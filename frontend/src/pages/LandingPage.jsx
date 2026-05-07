import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRange, Shield, Ticket } from "lucide-react";

import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [pending, setPending] = useState(false);

  async function handleLogin(form) {
    setPending(true);

    try {
      await login({
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard");
    } finally {
      setPending(false);
    }
  }

  async function handleRegister(form) {
    setPending(true);

    try {
      await register(form);
      navigate("/dashboard");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="landing-shell">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <p className="eyebrow">School Event Management System</p>
          <h1>Run registrations, manage campus events, and keep every student in the loop.</h1>
          <p className="hero-summary">
            This frontend is connected to your Express and MongoDB backend, with JWT login and role-based
            actions already wired in.
          </p>
        </div>

        <div className="hero-panel__metrics">
          <div className="metric-card">
            <CalendarRange size={18} />
            <div>
              <strong>Event calendar</strong>
              <p>Track schedules, venues, and registration counts in one place.</p>
            </div>
          </div>
          <div className="metric-card">
            <Shield size={18} />
            <div>
              <strong>Admin controls</strong>
              <p>Create, edit, and remove events with the same JWT auth your API already uses.</p>
            </div>
          </div>
          <div className="metric-card">
            <Ticket size={18} />
            <div>
              <strong>Student sign-ups</strong>
              <p>Students can log in, browse events, and register with one click.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-toggle">
          <button
            className={mode === "login" ? "toggle-button active" : "toggle-button"}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === "register" ? "toggle-button active" : "toggle-button"}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <AuthCard mode={mode} onSubmit={mode === "login" ? handleLogin : handleRegister} pending={pending} />
      </section>
    </main>
  );
}
