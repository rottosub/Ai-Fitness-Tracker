# 🏋️ AI Fitness Tracker

An intelligent full-stack fitness and wellness tracking web application designed to help users log workouts, monitor daily activity metrics, evaluate health parameters (such as BMI and TDEE), and receive personalized AI-driven workout and nutrition recommendations based on their health goals.

---

## 👥 Team & Contribution Breakdown

| Team Member | Role | Core Contributions |
| :--- | :--- | :--- |
| **Subroto Chandra**<br>`subrotochandra9097@gmail.com` | **Backend & AI Architecture** | • Custom User Model & Profile Database Architecture<br>• JWT Authentication with SimpleJWT & CORS Configuration<br>• Intelligent AI Fitness Coach Recommendation Engine<br>• REST APIs for Profile, BMI, Activities & Summary Aggregations<br>• Automated Unit Test Suite (`APITestCase`) & `requirements.txt` |
| **Yuvraj Janghela**<br>`yuvrajjanghela174@gmail.com` | **Frontend & UI/UX (React)** | • React 19 + Vite Application Architecture<br>• User Authentication Flow (Login & Multi-field Registration)<br>• Live Dashboard Integration (real-time state & API hydration)<br>• Interactive Activity Logging & Delete Modals<br>• AI Fitness Coach Panel, Macronutrient Visualizer & Responsive Theme |

---

## 🚀 Key Features

* **🔐 Secure Authentication**: JWT (JSON Web Token) authentication flow supporting registration, login, and secure authenticated requests.
* **📊 Live Fitness Dashboard**: Real-time aggregation of total steps, workout minutes, and calories burned with goal progress meters.
* **⚖️ Dynamic Health Screening**: Automatic BMI calculation with weight status categorization (Healthy weight, Underweight, Overweight, Obesity).
* **🤖 Smart AI Fitness Coach**:
  * Calculates Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
  * Automatically formulates daily calorie and step targets based on user goals (*Weight Loss*, *Muscle Building*, *Endurance*, *General Fitness*).
  * Generates custom exercise routines with sets, reps, and intensity levels.
  * Provides macronutrient split (Protein, Carbs, Healthy Fats) and targeted dietary advice.
  * Delivers motivational coaching feedback tailored to recent logged activity.
* **📝 Activity Tracking**: Modal to easily log daily steps, workout duration, and estimated calories burned, with instant deletion capability.
* **⚙️ Profile Management**: In-app modal to update height, weight, and fitness goals with immediate BMI recalculation.

---

## 🛠️ Technology Stack

### Backend
* **Python 3.10+**
* **Django 5.2** & **Django REST Framework (DRF)**
* **SimpleJWT** for access & refresh token authentication
* **django-cors-headers** for cross-origin API access
* **PostgreSQL / SQLite** for database storage

### Frontend
* **React 19**
* **Vite 8**
* **Modern CSS3** (Custom responsive dark/green fitness design system, Flexbox, CSS Grid)

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/register/` | Register a new user and create fitness profile | No |
| `POST` | `/api/login/` | Obtain JWT access and refresh token pair | No |
| `POST` | `/api/token/refresh/` | Refresh expired access token | No |
| `GET` | `/api/profile/` | Retrieve authenticated user profile | Yes |
| `PATCH`| `/api/profile/` | Update profile attributes (weight, height, goal) | Yes |
| `GET` | `/api/bmi/` | Calculate BMI and category from user profile | Yes |
| `GET` | `/api/activities/` | List all activity logs for authenticated user | Yes |
| `POST` | `/api/activities/` | Log new activity (steps, duration, calories, date) | Yes |
| `DELETE`| `/api/activities/<id>/`| Delete specific activity log | Yes |
| `GET` | `/api/summary/` | Get aggregated totals and averages | Yes |
| `GET` | `/api/ai/recommendations/`| Generate personalized AI fitness & diet recommendations | Yes |

---

## ⚡ Quick Start & Setup Guide

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# (Optional) Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver 8000
```
Backend will be available at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be available at `http://localhost:5173/`.

---

### 3. Running Backend Unit Tests

```bash
cd backend
python manage.py test users
```

---

## 📄 License
This project is developed for educational and academic submission purposes.
