const mongoose = require("mongoose");

const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { isPositiveInteger } = require("../utils/validators");

function validateEventInput(body = {}) {
  const { title, description, event_date: eventDate, event_time: eventTime, venue, capacity } = body;

  if (!title || !description || !eventDate || !eventTime || !venue || capacity === undefined) {
    return "All event fields are required";
  }

  if (!isPositiveInteger(Number(capacity))) {
    return "Capacity must be a positive number";
  }

  return null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function formatEvent(eventDocument) {
  const registeredCount = await Registration.countDocuments({ event_id: eventDocument._id });

  return {
    id: eventDocument._id.toString(),
    title: eventDocument.title,
    description: eventDocument.description,
    event_date: eventDocument.event_date,
    event_time: eventDocument.event_time,
    venue: eventDocument.venue,
    capacity: eventDocument.capacity,
    created_at: eventDocument.created_at,
    created_by: eventDocument.created_by?._id
      ? eventDocument.created_by._id.toString()
      : eventDocument.created_by.toString(),
    created_by_name: eventDocument.created_by?.name,
    registered_count: registeredCount,
  };
}

async function getEvents(req, res, next) {
  try {
    const eventDocuments = await Event.find()
      .populate("created_by", "name")
      .sort({ event_date: 1, event_time: 1 });

    const events = await Promise.all(eventDocuments.map((eventDocument) => formatEvent(eventDocument)));
    res.json({ events });
  } catch (error) {
    next(error);
  }
}

async function getEventById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const eventDocument = await Event.findById(req.params.id).populate("created_by", "name");

    if (!eventDocument) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await Registration.find({ event_id: req.params.id })
      .populate("user_id", "name email role")
      .sort({ registered_at: 1 });

    const attendees = registrations.map((registration) => ({
      id: registration.user_id._id.toString(),
      name: registration.user_id.name,
      email: registration.user_id.email,
      role: registration.user_id.role,
      registered_at: registration.registered_at,
    }));

    res.json({ event: await formatEvent(eventDocument), attendees });
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const validationError = validateEventInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { title, description, event_date: eventDate, event_time: eventTime, venue, capacity } =
      req.body;

    const eventDocument = await Event.create({
      title: title.trim(),
      description: description.trim(),
      event_date: eventDate,
      event_time: eventTime,
      venue: venue.trim(),
      capacity: Number(capacity),
      created_by: req.user.id,
    });

    const populatedEvent = await Event.findById(eventDocument._id).populate("created_by", "name");
    res.status(201).json({
      message: "Event created successfully",
      event: await formatEvent(populatedEvent),
    });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const validationError = validateEventInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const existingEvent = await Event.findById(req.params.id);

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { title, description, event_date: eventDate, event_time: eventTime, venue, capacity } =
      req.body;

    existingEvent.title = title.trim();
    existingEvent.description = description.trim();
    existingEvent.event_date = eventDate;
    existingEvent.event_time = eventTime;
    existingEvent.venue = venue.trim();
    existingEvent.capacity = Number(capacity);
    await existingEvent.save();

    const populatedEvent = await Event.findById(req.params.id).populate("created_by", "name");
    res.json({
      message: "Event updated successfully",
      event: await formatEvent(populatedEvent),
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const existingEvent = await Event.findById(req.params.id);

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Registration.deleteMany({ event_id: req.params.id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function registerForEvent(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingRegistration = await Registration.findOne({
      user_id: req.user.id,
      event_id: req.params.id,
    }).select("_id");

    if (existingRegistration) {
      return res.status(409).json({ message: "You are already registered for this event" });
    }

    const registeredCount = await Registration.countDocuments({ event_id: req.params.id });

    if (registeredCount >= event.capacity) {
      return res.status(400).json({ message: "Event is already full" });
    }

    await Registration.create({
      user_id: req.user.id,
      event_id: req.params.id,
    });

    res.status(201).json({ message: "Registered for event successfully" });
  } catch (error) {
    next(error);
  }
}

async function unregisterFromEvent(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const registration = await Registration.findOne({
      user_id: req.user.id,
      event_id: req.params.id,
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    await Registration.findByIdAndDelete(registration._id);
    res.json({ message: "Registration removed successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  registerForEvent,
  unregisterFromEvent,
  updateEvent,
};
