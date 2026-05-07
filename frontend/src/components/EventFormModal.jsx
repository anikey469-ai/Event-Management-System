import { useEffect, useState } from "react";

const emptyEvent = {
  title: "",
  description: "",
  event_date: "",
  event_time: "",
  venue: "",
  capacity: 50,
};

export default function EventFormModal({ event, onClose, onSave, pending }) {
  const [form, setForm] = useState(emptyEvent);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        event_time: event.event_time,
        venue: event.venue,
        capacity: event.capacity,
      });
      return;
    }

    setForm(emptyEvent);
  }, [event]);

  function updateField(eventObject) {
    const { name, value } = eventObject.target;
    setForm((current) => ({ ...current, [name]: name === "capacity" ? Number(value) : value }));
  }

  async function handleSubmit(eventObject) {
    eventObject.preventDefault();
    setError("");

    try {
      await onSave(form);
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card">
        <div className="modal-card__header">
          <div>
            <p className="eyebrow">{event ? "Update event" : "Create event"}</p>
            <h3>{event ? "Edit event details" : "Plan a new school event"}</h3>
          </div>
          <button aria-label="Close" className="icon-button" onClick={onClose} type="button">
            x
          </button>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input name="title" onChange={updateField} required value={form.title} />
          </label>

          <label>
            <span>Description</span>
            <textarea
              name="description"
              onChange={updateField}
              required
              rows="4"
              value={form.description}
            />
          </label>

          <div className="field-grid">
            <label>
              <span>Date</span>
              <input name="event_date" onChange={updateField} required type="date" value={form.event_date} />
            </label>

            <label>
              <span>Time</span>
              <input
                name="event_time"
                onChange={updateField}
                placeholder="10:00 AM"
                required
                type="text"
                value={form.event_time}
              />
            </label>
          </div>

          <div className="field-grid">
            <label>
              <span>Venue</span>
              <input name="venue" onChange={updateField} required value={form.venue} />
            </label>

            <label>
              <span>Capacity</span>
              <input
                min="1"
                name="capacity"
                onChange={updateField}
                required
                type="number"
                value={form.capacity}
              />
            </label>
          </div>

          {error ? <div className="form-alert">{error}</div> : null}

          <div className="modal-actions">
            <button className="secondary-button" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="primary-button" disabled={pending} type="submit">
              {pending ? "Saving..." : event ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
