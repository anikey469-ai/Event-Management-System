const express = require("express");

const {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  registerForEvent,
  unregisterFromEvent,
  updateEvent,
} = require("../controllers/eventController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", authenticate, authorize("admin"), createEvent);
router.put("/:id", authenticate, authorize("admin"), updateEvent);
router.delete("/:id", authenticate, authorize("admin"), deleteEvent);
router.post("/:id/register", authenticate, authorize("student", "admin"), registerForEvent);
router.delete("/:id/register", authenticate, authorize("student", "admin"), unregisterFromEvent);

module.exports = router;

