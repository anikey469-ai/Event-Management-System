import { CalendarDays, MapPin, Pencil, Trash2, UserPlus, UserRoundMinus, Users } from "lucide-react";

export default function EventList({
  events,
  onDelete,
  onEdit,
  onRegister,
  onSelect,
  onUnregister,
  pendingEventId,
  registeredIds,
  role,
}) {
  if (!events.length) {
    return (
      <div className="empty-state">
        <h3>No events yet</h3>
        <p>Once an admin creates events, they will show up here for the whole school.</p>
      </div>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => {
        const isRegistered = registeredIds.includes(event.id);
        const isPending = pendingEventId === event.id;
        const isAdmin = role === "admin";

        return (
          <article className="event-card" key={event.id}>
            <div className="event-card__top">
              <div>
                <p className="eyebrow">Campus event</p>
                <h3>{event.title}</h3>
              </div>
              <button className="chip-button" onClick={() => onSelect(event.id)} type="button">
                Details
              </button>
            </div>

            <p className="event-card__description">{event.description}</p>

            <div className="detail-stack">
              <span>
                <CalendarDays size={16} /> {event.event_date} at {event.event_time}
              </span>
              <span>
                <MapPin size={16} /> {event.venue}
              </span>
              <span>
                <Users size={16} /> {event.registered_count}/{event.capacity} registered
              </span>
            </div>

            <div className="event-card__footer">
              {isAdmin ? (
                <div className="inline-actions">
                  <button className="icon-text-button" onClick={() => onEdit(event)} type="button">
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    className="icon-text-button danger"
                    disabled={isPending}
                    onClick={() => onDelete(event.id)}
                    type="button"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ) : (
                <button
                  className={isRegistered ? "secondary-button" : "primary-button"}
                  disabled={isPending}
                  onClick={() => (isRegistered ? onUnregister(event.id) : onRegister(event.id))}
                  type="button"
                >
                  {isRegistered ? (
                    <>
                      <UserRoundMinus size={16} /> {isPending ? "Removing..." : "Cancel Registration"}
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> {isPending ? "Registering..." : "Register"}
                    </>
                  )}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
