import { useState } from "react";
import "./App.css";
import Login from "./Login";

function App() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("accessToken")
  );

  const [steps, setSteps] = useState(8500);
  const [workout, setWorkout] = useState(45);
  const [calories, setCalories] = useState(350);
  const [bmi, setBmi] = useState(24.49);

  function handleLogin(accessToken) {
    sessionStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
  }

  function handleLogout() {
    sessionStorage.removeItem("accessToken");
    setToken(null);
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

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
            <div className="avatar">S</div>
            <span>My Dashboard</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="welcome-card" id="dashboard">
          <div>
            <p className="eyebrow">YOUR PROGRESS MATTERS</p>
            <h2>Small steps. Stronger you.</h2>
            <p>
              Track your movement, monitor your workouts,
              and keep working toward your fitness goals.
            </p>
          </div>

          <div className="welcome-icon">✦</div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <span>Daily Steps</span>
              <span className="stat-icon">👟</span>
            </div>
            <h2>{steps.toLocaleString()}</h2>
            <p>Steps recorded</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((steps / 10000) * 100, 100)}%` }}
              />
            </div>
            <small>Goal: 10,000 steps</small>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Workout Duration</span>
              <span className="stat-icon">⏱</span>
            </div>
            <h2>{workout} <span className="unit">min</span></h2>
            <p>Workout completed</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((workout / 60) * 100, 100)}%` }}
              />
            </div>
            <small>Goal: 60 minutes</small>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Calories Burned</span>
              <span className="stat-icon">🔥</span>
            </div>
            <h2>{calories} <span className="unit">kcal</span></h2>
            <p>Estimated activity burn</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((calories / 500) * 100, 100)}%` }}
              />
            </div>
            <small>Goal: 500 kcal</small>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Body Mass Index</span>
              <span className="stat-icon">⚖</span>
            </div>
            <h2>{bmi}</h2>
            <p>BMI calculated from your profile</p>
            <span className="status-pill">BMI</span>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel" id="activity">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">YOUR MOVEMENT</p>
                <h2>Activity Overview</h2>
              </div>
              <span className="date-label">Sample data</span>
            </div>

            <div className="activity-row">
              <div className="activity-symbol">👟</div>
              <div className="activity-info">
                <strong>Walking</strong>
                <span>Daily movement</span>
              </div>
              <strong>{steps.toLocaleString()} steps</strong>
            </div>

            <div className="activity-row">
              <div className="activity-symbol">🏋️</div>
              <div className="activity-info">
                <strong>Workout</strong>
                <span>Exercise session</span>
              </div>
              <strong>{workout} min</strong>
            </div>

            <div className="activity-row">
              <div className="activity-symbol">🔥</div>
              <div className="activity-info">
                <strong>Energy expenditure</strong>
                <span>Estimated calories</span>
              </div>
              <strong>{calories} kcal</strong>
            </div>
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
              <span>Your BMI</span>
              <strong>{bmi}</strong>
              <span className="status-pill">BMI screening measure</span>
            </div>

            <p className="health-note">
              BMI is a screening measure based on height and weight.
              It does not measure body fat directly or diagnose health.
            </p>
          </article>
        </section>

        <section className="demo-controls">
          <div>
            <h2>Dashboard Preview Controls</h2>
            <p>
              These are temporary sample values. We will connect real
              backend data next.
            </p>
          </div>

          <div className="controls-grid">
            <label>
              Steps
              <input
                type="number"
                min="0"
                value={steps}
                onChange={(e) => setSteps(Math.max(0, Number(e.target.value)))}
              />
            </label>

            <label>
              Workout minutes
              <input
                type="number"
                min="0"
                value={workout}
                onChange={(e) => setWorkout(Math.max(0, Number(e.target.value)))}
              />
            </label>

            <label>
              Calories burned
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(Math.max(0, Number(e.target.value)))}
              />
            </label>

            <label>
              BMI
              <input
                type="number"
                min="0"
                step="0.01"
                value={bmi}
                onChange={(e) => setBmi(Math.max(0, Number(e.target.value)))}
              />
            </label>
          </div>
        </section>

        <footer>
          AI Fitness Tracker · Keep moving at your own pace.
        </footer>
      </main>
    </div>
  );
}

export default App;