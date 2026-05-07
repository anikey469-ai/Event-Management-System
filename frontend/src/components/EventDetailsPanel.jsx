import { CalendarDays, MapPin, ShieldCheck, Users } from "lucide-react";

export default function EventDetailsPanel({ details }) {
  if (!details) {
    return (
      <aside className="details-panel">
        <p className="eyebrow">Event details</p>
        <h3>Select an event</h3>
        <p className="muted">Pick any event card to see attendees, venue info, and organizer details.</p>
      </aside>
    );
  }

  return (
    <aside className="details-panel">
      <p className="eyebrow">Event details</p>
      <h3>{details.event.title}</h3>
      <p className="muted">{details.event.description}</p>

      <div className="detail-stack">
        <span>
          <CalendarDays size={16} /> {details.event.event_date} at {details.event.event_time}
        </span>
        <span>
          <MapPin size={16} /> {details.event.venue}
        </span>
        <span>
          <Users size={16} /> {details.event.registered_count}/{details.event.capacity} seats filled
        </span>
        <span>
          <ShieldCheck size={16} /> Managed by {details.event.created_by_name}
        </span>
      </div>

      <div className="attendee-list">
        <div className="attendee-list__header">
          <h4>Attendees</h4>
          <span>{details.attendees.length}</span>
        </div>

        {details.attendees.length ? (
          details.attendees.map((attendee) => (
            <div className="attendee-item" key={attendee.id}>
              <div>
                <strong>{attendee.name}</strong>
                <p>{attendee.email}</p>
              </div>
              <span>{attendee.role}</span>
            </div>
          ))
        ) : (
          <p className="muted">No one has registered for this event yet.</p>
        )}
      </div>
    </aside>
  );
}
