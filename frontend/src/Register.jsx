import { useState } from "react";
import "./Register.css";

const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Building",
  "Cardio & Endurance",
  "General Fitness / Keep Fit",
  "Flexibility & Mobility",
];

function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    height: "",
    weight: "",
    goal: "Weight Loss",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (Number(formData.age) <= 0 || Number(formData.height) <= 0 || Number(formData.weight) <= 0) {
      setError("Age, height, and weight must be positive numbers.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        age: parseInt(formData.age, 10),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        goal: formData.goal,
      };

      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Collect server errors
        let errorMsg = "Registration failed.";
        if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            errorMsg = `${firstKey}: ${data[firstKey][0]}`;
          } else if (typeof data[firstKey] === "string") {
            errorMsg = data[firstKey];
          }
        }
        setError(errorMsg);
        return;
      }

      setSuccess("Account created successfully! Switching to sign in...");
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(formData.username);
        } else if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }, 1400);
    } catch {
      setError("Unable to connect to the backend server. Please check that Django is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-logo">F</div>

        <p className="register-eyebrow">START YOUR HEALTH JOURNEY</p>
        <h1>Create Account</h1>
        <p className="register-description">
          Set up your profile to receive smart AI fitness tracking.
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. john_doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirmPassword">Confirm Password</label>
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label htmlFor="reg-age">Age (yrs)</label>
              <input
                id="reg-age"
                name="age"
                type="number"
                min="10"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="22"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-height">Height (cm)</label>
              <input
                id="reg-height"
                name="height"
                type="number"
                step="0.1"
                min="50"
                max="250"
                value={formData.height}
                onChange={handleChange}
                placeholder="175"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-weight">Weight (kg)</label>
              <input
                id="reg-weight"
                name="weight"
                type="number"
                step="0.1"
                min="20"
                max="300"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-goal">Primary Fitness Goal</label>
            <select
              id="reg-goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
            >
              {FITNESS_GOALS.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="register-error" role="alert">{error}</p>}
          {success && <p className="register-success" role="status">{success}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <button type="button" className="link-button" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </p>
      </section>
    </main>
  );
}

export default Register;
