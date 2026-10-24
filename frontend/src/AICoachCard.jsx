import { useState, useEffect, useCallback } from "react";

function AICoachCard({ token, onActivityLoggedTrigger }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAIRecommendations = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ai/recommendations/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI plan");
      }

      const data = await response.json();
      setAiData(data);
    } catch {
      setError("Unable to generate AI recommendations. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAIRecommendations();
  }, [fetchAIRecommendations, onActivityLoggedTrigger]);

  if (loading && !aiData) {
    return (
      <section className="ai-coach-panel loading" id="ai-coach">
        <div className="ai-loading-spinner">✦ Generating your personalized AI fitness plan...</div>
      </section>
    );
  }

  if (error && !aiData) {
    return (
      <section className="ai-coach-panel error" id="ai-coach">
        <p>⚠️ {error}</p>
        <button type="button" className="action-btn" onClick={fetchAIRecommendations}>
          Retry AI Engine
        </button>
      </section>
    );
  }

  if (!aiData) return null;

  const { daily_targets, macronutrient_split, ai_workout_plan, ai_nutrition_plan, coach_insights } = aiData;

  return (
    <section className="ai-coach-panel" id="ai-coach">
      <div className="ai-header">
        <div className="ai-title-group">
          <span className="ai-badge">✦ AI FITNESS COACH</span>
          <h2>{coach_insights?.headline || "Smart Personalized Plan"}</h2>
          <p className="ai-subtitle">
            Tailored dynamically to your body metrics, BMI, and logged activity history.
          </p>
        </div>
        <button
          type="button"
          className="refresh-ai-btn"
          onClick={fetchAIRecommendations}
          disabled={loading}
          title="Recalculate AI plan"
        >
          {loading ? "Refreshing..." : "↻ Refresh AI Plan"}
        </button>
      </div>

      <div className="ai-coach-banner">
        <div className="ai-avatar">🤖</div>
        <div className="ai-insight-text">
          <strong>Coach's Insight</strong>
          <p>{coach_insights?.advice}</p>
          <small className="ai-feedback-note">{coach_insights?.progress_feedback}</small>
        </div>
      </div>

      <div className="ai-metrics-row">
        <div className="ai-metric-box">
          <span className="metric-label">Daily Target Calories</span>
          <span className="metric-val">{daily_targets?.target_calories} <small>kcal</small></span>
          <span className="metric-hint">BMR: {daily_targets?.bmr} · TDEE: {daily_targets?.tdee}</span>
        </div>

        <div className="ai-metric-box">
          <span className="metric-label">Target Daily Steps</span>
          <span className="metric-val">{(daily_targets?.target_steps || 0).toLocaleString()} <small>steps</small></span>
          <span className="metric-hint">Optimal cardio zone</span>
        </div>

        <div className="ai-metric-box">
          <span className="metric-label">Target Workout Time</span>
          <span className="metric-val">{daily_targets?.target_workout_minutes} <small>mins/day</small></span>
          <span className="metric-hint">{ai_workout_plan?.focus}</span>
        </div>
      </div>

      <div className="ai-details-grid">
        <div className="ai-card workout-plan-card">
          <div className="card-top">
            <h4>🏋️ Recommended AI Workout Routine</h4>
            <span className="focus-pill">{ai_workout_plan?.focus}</span>
          </div>
          <ul className="routine-list">
            {ai_workout_plan?.routine?.map((item, idx) => (
              <li key={idx} className="routine-item">
                <div className="routine-main">
                  <strong>{item.exercise}</strong>
                  <span>{item.sets_reps}</span>
                </div>
                <span className={`intensity-tag ${item.intensity.toLowerCase()}`}>
                  {item.intensity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ai-card nutrition-plan-card">
          <div className="card-top">
            <h4>🥗 AI Nutrition & Macro Split</h4>
          </div>

          <div className="macro-bar-container">
            <div className="macro-labels">
              <span>🍗 Protein: {macronutrient_split?.protein?.grams}g ({macronutrient_split?.protein?.percentage}%)</span>
              <span>🌾 Carbs: {macronutrient_split?.carbohydrates?.grams}g ({macronutrient_split?.carbohydrates?.percentage}%)</span>
              <span>🥑 Healthy Fats: {macronutrient_split?.fats?.grams}g ({macronutrient_split?.fats?.percentage}%)</span>
            </div>
            <div className="macro-progress">
              <div
                className="macro-seg protein"
                style={{ width: `${macronutrient_split?.protein?.percentage}%` }}
                title="Protein"
              />
              <div
                className="macro-seg carbs"
                style={{ width: `${macronutrient_split?.carbohydrates?.percentage}%` }}
                title="Carbohydrates"
              />
              <div
                className="macro-seg fats"
                style={{ width: `${macronutrient_split?.fats?.percentage}%` }}
                title="Healthy Fats"
              />
            </div>
          </div>

          <div className="nutrition-tips">
            <strong>Dietary Guidelines:</strong>
            <ul>
              {ai_nutrition_plan?.tips?.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AICoachCard;
