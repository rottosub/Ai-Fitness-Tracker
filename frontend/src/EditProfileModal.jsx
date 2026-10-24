import { useState, useEffect } from "react";

const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Building",
  "Cardio & Endurance",
  "General Fitness / Keep Fit",
  "Flexibility & Mobility",
];

function EditProfileModal({ isOpen, onClose, profile, token, onProfileUpdated }) {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("Weight Loss");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setAge(profile.age || "");
      setHeight(profile.height || "");
      setWeight(profile.weight || "");
      setGoal(profile.goal || "Weight Loss");
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const parsedAge = parseInt(age, 10);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    if (parsedAge <= 0 || parsedHeight <= 0 || parsedWeight <= 0) {
      setError("Age, height, and weight must be positive numbers.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: parsedAge,
          height: parsedHeight,
          weight: parsedWeight,
          goal: goal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Failed to update profile settings.");
        return;
      }

      onProfileUpdated();
      onClose();
    } catch {
      setError("Unable to connect to the backend server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">USER PROFILE SETTINGS</p>
            <h3>Update Fitness Profile</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-goal">Fitness Goal</label>
            <select
              id="edit-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            >
              {FITNESS_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label htmlFor="edit-age">Age</label>
              <input
                id="edit-age"
                type="number"
                min="10"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-height">Height (cm)</label>
              <input
                id="edit-height"
                type="number"
                step="0.1"
                min="50"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-weight">Weight (kg)</label>
              <input
                id="edit-weight"
                type="number"
                step="0.1"
                min="20"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="modal-error" role="alert">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
