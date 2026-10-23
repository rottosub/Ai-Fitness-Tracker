import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

const API_BASE = "http://127.0.0.1:8000/api";

function App() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("accessToken")
  );
  const [authView, setAuthView] = useState("login");

  // Live state from backend
  const [profile, setProfile] = useState(null);
  const [bmiData, setBmiData] = useState(null);
  const [summary, setSummary] = useState({
    total_steps: 0,
    total_workout_minutes: 0,
    total_calories_burned: 0,
    activity_records: 0,
    average_steps: 0,
    average_workout_minutes: 0,
    average_calories_burned: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    setToken(null);
    setProfile(null);
    setBmiData(null);
    setActivities([]);
    setAuthView("login");
  }, []);

  function handleLogin(accessToken, refreshToken) {
    sessionStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      sessionStorage.setItem("refreshToken", refreshToken);
    }
    setToken(accessToken);
  }

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setFetchError("");

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const [profileRes, bmiRes, summaryRes, activitiesRes] = await Promise.all([
        fetch(`${API_BASE}/profile/`, { headers: authHeaders }),
        fetch(`${API_BASE}/bmi/`, { headers: authHeaders }),
        fetch(`${API_BASE}/summary/`, { headers: authHeaders }),
        fetch(`${API_BASE}/activities/`, { headers: authHeaders }),
      ]);

      if (
        profileRes.status === 401 ||
        bmiRes.status === 401 ||
        summaryRes.status === 401 ||
        activitiesRes.status === 401
      ) {
        handleLogout();
        return;
      }

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData);
      }
      if (bmiRes.ok) {
        const bData = await bmiRes.json();
        setBmiData(bData);
      }
      if (summaryRes.ok) {
        const sData = await summaryRes.json();
        setSummary(sData);
      }
      if (activitiesRes.ok) {
        const aData = await activitiesRes.json();
        setActivities(aData);
      }
    } catch {
      setFetchError("Unable to reach the server. Make sure the Django backend is active.");
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData]);

  if (!token) {
    if (authView === "register") {
      return (
        <Register
          onSwitchToLogin={() => setAuthView("login")}
          onRegisterSuccess={() => setAuthView("login")}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  const userInitial = profile?.username ? profile.username[0].toUpperCase() : "U";

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>FitTrack</h2>

        <nav>
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#activity">Activity</a>
          <a href="#health">Health Metrics</a>
        </nav>

        <div className="sidebar-footer">
          <p>AI Fitness Tracker</p>
          <small>Stay active. Stay healthy.</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL FITNESS SPACE</p>
            <h1>Fitness Dashboard</h1>
          </div>

          <div className="user-badge">
            <div className="avatar">{userInitial}</div>
            <div className="user-meta">
              <strong>{profile?.username || "My Dashboard"}</strong>
              {profile?.goal && <small className="user-goal-pill">{profile.goal}</small>}
            </div>
            <button type="button" onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        {fetchError && (
          <div className="banner-alert" role="alert">
            <span>⚠️ {fetchError}</span>
            <button type="button" onClick={fetchDashboardData}>Retry</button>
          </div>
        )}

        {loading && <p className="loading-bar">Fetching live fitness data...</p>}

        <section className="welcome-card" id="dashboard">
          <div>
            <p className="eyebrow">WELCOME BACK{profile?.username ? `, ${profile.username.toUpperCase()}` : ""}</p>
            <h2>Small steps. Stronger you.</h2>
            <p>
              Goal: <strong>{profile?.goal || "Stay Active & Healthy"}</strong> · Weight: {profile?.weight || "--"} kg · Height: {profile?.height || "--"} cm
            </p>
          </div>

          <div className="welcome-icon">✦</div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <span>Total Steps</span>
              <span className="stat-icon">👟</span>
            </div>
            <h2>{(summary.total_steps || 0).toLocaleString()}</h2>
            <p>Steps recorded</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(((summary.total_steps || 0) / 10000) * 100, 100)}%` }}
              />
            </div>
            <small>Goal: 10,000 steps</small>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Workout Duration</span>
              <span className="stat-icon">⏱</span>
            </div>
            <h2>{summary.total_workout_minutes || 0} <span className="unit">min</span></h2>
            <p>Total exercise completed</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(((summary.total_workout_minutes || 0) / 60) * 100, 100)}%` }}
              />
            </div>
            <small>Avg: {summary.average_workout_minutes || 0} min/session</small>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Calories Burned</span>
              <span className="stat-icon">🔥</span>
            </div>
            <h2>{(summary.total_calories_burned || 0).toLocaleString()} <span className="unit">kcal</span></h2>
            <p>Total activity burn</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(((summary.total_calories_burned || 0) / 500) * 100, 100)}%` }}
              />
            </div>
            <small>{summary.activity_records} total sessions logged</small>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Body Mass Index</span>
              <span className="stat-icon">⚖</span>
            </div>
            <h2>{bmiData?.bmi || "--"}</h2>
            <p>{bmiData?.category || "Calculated from your profile"}</p>
            <span className="status-pill">{bmiData?.category || "BMI"}</span>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel" id="activity">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">YOUR MOVEMENT</p>
                <h2>Recent Activities</h2>
              </div>
              <span className="date-label">{activities.length} entries</span>
            </div>

            {activities.length === 0 ? (
              <div className="empty-state">
                <p>No activity logs recorded yet.</p>
                <small>Log your daily steps and workouts to start tracking.</small>
              </div>
            ) : (
              <div className="activity-list">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="activity-row">
                    <div className="activity-symbol">🏃</div>
                    <div className="activity-info">
                      <strong>{act.activity_date}</strong>
                      <span>{act.steps.toLocaleString()} steps · {act.workout_duration} mins</span>
                    </div>
                    <strong>{act.calories_burned} kcal</strong>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="panel" id="health">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">YOUR WELLNESS</p>
                <h2>Health Metrics</h2>
              </div>
              <span className="health-icon">♥</span>
            </div>

            <div className="bmi-display">
              <span>Calculated BMI</span>
              <strong>{bmiData?.bmi || "--"}</strong>
              <span className="status-pill">{bmiData?.category || "Awaiting profile data"}</span>
            </div>

            <p className="health-note">
              BMI is a screening measure based on height ({profile?.height || "--"} cm) and weight ({profile?.weight || "--"} kg).
              It classifies weight status into healthy, underweight, overweight, or obesity categories.
            </p>
          </article>
        </section>

        <footer>
          AI Fitness Tracker · Keep moving at your own pace.
        </footer>
      </main>
    </div>
  );
}

export default App;
