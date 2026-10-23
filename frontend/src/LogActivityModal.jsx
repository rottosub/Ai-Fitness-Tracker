import { useState } from "react";

function LogActivityModal({ isOpen, onClose, onActivityLogged, token }) {
  const today = new Date().toISOString().split("T")[0];
  const [activityDate, setActivityDate] = useState(today);
  const [steps, setSteps] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const s = parseInt(steps || 0, 10);
    const d = parseInt(workoutDuration || 0, 10);
    const c = parseInt(caloriesBurned || 0, 10);

    if (s <= 0 && d <= 0 && c <= 0) {
      setError("Please enter at least one metric greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/activities/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activity_date: activityDate,
          steps: s,
          workout_duration: d,
          calories_burned: c,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Failed to log workout activity.");
        return;
      }

      // Reset form and notify parent
      setSteps("");
      setWorkoutDuration("");
      setCaloriesBurned("");
      setActivityDate(today);
      onActivityLogged();
      onClose();
    } catch {
      setError("Server connection failed. Make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">FITNESS TRACKER</p>
            <h3>Log Workout & Activity</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="modal-date">Activity Date</label>
            <input
              id="modal-date"
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-steps">Steps Count 👟</label>
            <input
              id="modal-steps"
              type="number"
              min="0"
              placeholder="e.g. 7500"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-duration">Workout Duration (minutes) ⏱</label>
            <input
              id="modal-duration"
              type="number"
              min="0"
              placeholder="e.g. 45"
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-calories">Calories Burned (kcal) 🔥</label>
            <input
              id="modal-calories"
              type="number"
              min="0"
              placeholder="e.g. 320"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
            />
          </div>

          {error && <p className="modal-error" role="alert">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogActivityModal;
