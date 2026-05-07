import { useState } from "react";

const initialForm = {
  email: "",
  name: "",
  password: "",
  role: "student",
};

export default function AuthCard({ mode, onSubmit, pending }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await onSubmit(form);
      setForm(initialForm);
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-card__intro">
        <p className="eyebrow">{isRegister ? "Create account" : "Welcome back"}</p>
        <h2>{isRegister ? "Join the campus event hub" : "Sign in to your workspace"}</h2>
        <p className="muted">
          {isRegister
            ? "Students can discover events and admins can manage the entire schedule."
            : "Use the same account you created from the backend or Postman tests."}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isRegister ? (
          <label>
            <span>Name</span>
            <input
              name="name"
              onChange={updateField}
              placeholder="Aniket Sharma"
              required
              value={form.name}
            />
          </label>
        ) : null}

        <label>
          <span>Email</span>
          <input
            name="email"
            onChange={updateField}
            placeholder="student@school.com"
            required
            type="email"
            value={form.email}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            name="password"
            onChange={updateField}
            placeholder="Minimum 6 characters"
            required
            type="password"
            value={form.password}
          />
        </label>

        {isRegister ? (
          <label>
            <span>Role</span>
            <select name="role" onChange={updateField} value={form.role}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        ) : null}

        {error ? <div className="form-alert">{error}</div> : null}

        <button className="primary-button" disabled={pending} type="submit">
          {pending ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
}
