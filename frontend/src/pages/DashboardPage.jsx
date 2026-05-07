import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, RefreshCw } from "lucide-react";

import EventDetailsPanel from "../components/EventDetailsPanel";
import EventFormModal from "../components/EventFormModal";
import EventList from "../components/EventList";
import { useAuth } from "../context/AuthContext";
import {
  createEvent,
  deleteEvent,
  getEventDetails,
  getEvents,
  registerForEvent,
  unregisterFromEvent,
  updateEvent,
} from "../services/api";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout, token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [pendingEventId, setPendingEventId] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [savePending, setSavePending] = useState(false);

  const registeredIds = useMemo(() => {
    if (!user || user.role !== "student" || !selectedEventDetails) {
      return [];
    }

    return selectedEventDetails.attendees
      .filter((attendee) => attendee.email === user.email)
      .map(() => selectedEventDetails.event.id);
  }, [selectedEventDetails, user]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadEventDetails(selectedEventId);
    }
  }, [selectedEventId]);

  async function loadEvents() {
    setIsLoading(true);

    try {
      const response = await getEvents();
      setEvents(response.events);

      if (!selectedEventId && response.events.length) {
        setSelectedEventId(response.events[0].id);
      }
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadEventDetails(eventId) {
    try {
      const response = await getEventDetails(eventId);
      setSelectedEventDetails(response);
    } catch (error) {
      setFeedback(error.message);
    }
  }

  async function handleRegister(eventId) {
    setPendingEventId(eventId);
    setFeedback("");

    try {
      await registerForEvent(eventId, token);
      await Promise.all([loadEvents(), loadEventDetails(eventId)]);
      setFeedback("Event registration successful.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setPendingEventId("");
    }
  }

  async function handleUnregister(eventId) {
    setPendingEventId(eventId);
    setFeedback("");

    try {
      await unregisterFromEvent(eventId, token);
      await Promise.all([loadEvents(), loadEventDetails(eventId)]);
      setFeedback("Registration removed successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setPendingEventId("");
    }
  }

  async function handleDelete(eventId) {
    setPendingEventId(eventId);
    setFeedback("");

    try {
      await deleteEvent(eventId, token);
      const nextEvents = events.filter((event) => event.id !== eventId);
      setEvents(nextEvents);
      setSelectedEventId(nextEvents[0]?.id || "");
      setSelectedEventDetails(null);
      setFeedback("Event deleted successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setPendingEventId("");
    }
  }

  async function handleSaveEvent(form) {
    setSavePending(true);
    setFeedback("");

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, form, token);
        setFeedback("Event updated successfully.");
      } else {
        await createEvent(form, token);
        setFeedback("Event created successfully.");
      }

      setShowEventModal(false);
      setEditingEvent(null);
      await loadEvents();
    } finally {
      setSavePending(false);
    }
  }

  function openCreateModal() {
    setEditingEvent(null);
    setShowEventModal(true);
  }

  function openEditModal(event) {
    setEditingEvent(event);
    setShowEventModal(true);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const heroStats = [
    { label: "Logged in as", value: user?.role || "guest" },
    { label: "Total events", value: String(events.length) },
    { label: "Selected event", value: selectedEventDetails?.event.title || "None" },
  ];

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Event operations</p>
          <h1>Hi {user?.name}, your campus dashboard is ready.</h1>
          <p className="muted">
            {user?.role === "admin"
              ? "Create schedules, keep attendance visible, and manage registrations in one place."
              : "Browse upcoming events, check capacity, and register using your saved session token."}
          </p>
        </div>

        <div className="header-actions">
          <button className="secondary-button" onClick={loadEvents} type="button">
            <RefreshCw size={16} /> Refresh
          </button>
          {user?.role === "admin" ? (
            <button className="primary-button" onClick={openCreateModal} type="button">
              <Plus size={16} /> New Event
            </button>
          ) : null}
          <button className="icon-text-button" onClick={handleLogout} type="button">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <section className="stats-row">
        {heroStats.map((stat) => (
          <div className="stats-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      {feedback ? <div className="feedback-banner">{feedback}</div> : null}

      <section className="dashboard-layout">
        <section className="events-column">
          <div className="section-head">
            <div>
              <p className="eyebrow">Upcoming events</p>
              <h2>Event board</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="empty-state">
              <h3>Loading events...</h3>
            </div>
          ) : (
            <EventList
              events={events}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onRegister={handleRegister}
              onSelect={setSelectedEventId}
              onUnregister={handleUnregister}
              pendingEventId={pendingEventId}
              registeredIds={registeredIds}
              role={user?.role}
            />
          )}
        </section>

        <EventDetailsPanel details={selectedEventDetails} />
      </section>

      {showEventModal ? (
        <EventFormModal
          event={editingEvent}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          pending={savePending}
        />
      ) : null}
    </main>
  );
}
