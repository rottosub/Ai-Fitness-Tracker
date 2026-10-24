"""
AI Fitness Coach & Recommendation Engine
Generates personalized fitness, workout, and nutrition plans based on user profile and activity.
"""

def calculate_bmr(weight_kg, height_cm, age):
    """Mifflin-St Jeor formula (assuming gender-neutral baseline of +5)."""
    return round((10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5)


def generate_fitness_plan(user, profile, activities_summary):
    """
    Generates intelligent fitness recommendations tailored to user profile,
    BMI, fitness goal, and past logged activities.
    """
    weight = float(profile.weight)
    height = float(profile.height)
    age = int(profile.age)
    goal = profile.goal or "General Fitness / Keep Fit"

    # Calculate BMI
    height_m = height / 100.0
    bmi = round(weight / (height_m ** 2), 2) if height_m > 0 else 22.0

    if bmi < 18.5:
        bmi_category = "Underweight"
    elif bmi < 25:
        bmi_category = "Healthy weight"
    elif bmi < 30:
        bmi_category = "Overweight"
    else:
        bmi_category = "Obesity"

    bmr = calculate_bmr(weight, height, age)
    # TDEE estimation for moderate activity
    tdee = round(bmr * 1.4)

    # Goal-based adjustments
    goal_lower = goal.lower()
    if "weight loss" in goal_lower or "loss" in goal_lower:
        target_calories = max(1300, tdee - 450)
        target_steps = 10000
        target_workout_minutes = 45
        macro_protein_pct = 35
        macro_carb_pct = 40
        macro_fat_pct = 25
        workout_focus = "Fat Loss & Aerobic Conditioning"
        workout_routine = [
            {"exercise": "Brisk Incline Walking / Light Jogging", "sets_reps": "25 mins", "intensity": "Moderate"},
            {"exercise": "Bodyweight Squats & Lunges", "sets_reps": "3 sets × 15 reps", "intensity": "Moderate"},
            {"exercise": "Plank & Mountain Climbers", "sets_reps": "3 sets × 45 secs", "intensity": "High"},
            {"exercise": "Jump Rope / High Knees", "sets_reps": "3 sets × 60 secs", "intensity": "High"},
        ]
        meal_tips = [
            "Start mornings with a high-protein breakfast (e.g. egg white scramble with spinach).",
            "Incorporate complex carbs (sweet potato, brown rice) around workout windows.",
            "Maintain a 400-500 kcal daily deficit with 2.5L+ hydration.",
        ]
        coach_message = "Focus on consistency and a sustainable caloric deficit. Steady walking and circuit training will preserve lean mass while trimming body fat."

    elif "muscle" in goal_lower or "building" in goal_lower:
        target_calories = tdee + 350
        target_steps = 8000
        target_workout_minutes = 60
        macro_protein_pct = 30
        macro_carb_pct = 50
        macro_fat_pct = 20
        workout_focus = "Hypertrophy & Progressive Overload"
        workout_routine = [
            {"exercise": "Barbell / Dumbbell Bench Press", "sets_reps": "4 sets × 8-10 reps", "intensity": "Heavy"},
            {"exercise": "Goblet Squats / Romanian Deadlifts", "sets_reps": "4 sets × 10-12 reps", "intensity": "Heavy"},
            {"exercise": "Pull-ups / Lat Pulldowns", "sets_reps": "3 sets × 10 reps", "intensity": "Moderate-High"},
            {"exercise": "Dumbbell Overhead Shoulder Press", "sets_reps": "3 sets × 12 reps", "intensity": "Moderate"},
        ]
        meal_tips = [
            "Aim for 1.8g to 2.2g of protein per kg of bodyweight to stimulate muscle protein synthesis.",
            "Consume quality post-workout carbs (oats, bananas, rice) for glycogen replenishment.",
            "Prioritize 7-8 hours of quality sleep for optimal muscle recovery.",
        ]
        coach_message = "Progressive overload is your north star! Add small increments of weight or reps every week while fueling your body with sufficient protein."

    elif "cardio" in goal_lower or "endurance" in goal_lower:
        target_calories = tdee
        target_steps = 12000
        target_workout_minutes = 50
        macro_protein_pct = 25
        macro_carb_pct = 55
        macro_fat_pct = 20
        workout_focus = "Cardiovascular Capacity & Stamina"
        workout_routine = [
            {"exercise": "Interval Sprint Running", "sets_reps": "6 intervals × 1 min on / 1 min off", "intensity": "High"},
            {"exercise": "Cycling / Rowing Ergometer", "sets_reps": "20 mins steady pace", "intensity": "Moderate"},
            {"exercise": "Core Stabilization (Bird-Dog & Hollow Hold)", "sets_reps": "3 sets × 40 secs", "intensity": "Moderate"},
            {"exercise": "Leg Mobility Stretches", "sets_reps": "10 mins post-workout", "intensity": "Low"},
        ]
        meal_tips = [
            "Fuel your aerobic sessions with slow-digesting oats, quinoa, and fruits.",
            "Replenish electrolytes after sweaty sessions with coconut water or electrolyte hydration.",
        ]
        coach_message = "Endurance is built step by step. Keep your heart rate in Zone 2-3 for aerobic base building, with one high-intensity interval day per week."

    else:
        # General Fitness / Keep Fit
        target_calories = tdee
        target_steps = 9000
        target_workout_minutes = 45
        macro_protein_pct = 30
        macro_carb_pct = 45
        macro_fat_pct = 25
        workout_focus = "Functional Strength & Longevity"
        workout_routine = [
            {"exercise": "Push-ups & Inverted Rows", "sets_reps": "3 sets × 12 reps", "intensity": "Moderate"},
            {"exercise": "Bodyweight Squats & Walking Lunges", "sets_reps": "3 sets × 15 reps", "intensity": "Moderate"},
            {"exercise": "Brisk Walk or Light Jog", "sets_reps": "20 mins", "intensity": "Moderate"},
            {"exercise": "Full Body Dynamic Mobility Flow", "sets_reps": "10 mins", "intensity": "Low"},
        ]
        meal_tips = [
            "Eat whole, unprocessed foods with plenty of leafy greens and clean proteins.",
            "Stay active throughout your working day by taking 5-minute walking breaks every hour.",
        ]
        coach_message = "Balance is key. Consistent movement, whole foods, and good sleep will keep your energy levels high all week long."

    # Macro grams calculation: Protein = 4 kcal/g, Carb = 4 kcal/g, Fat = 9 kcal/g
    protein_grams = round((target_calories * (macro_protein_pct / 100)) / 4)
    carbs_grams = round((target_calories * (macro_carb_pct / 100)) / 4)
    fat_grams = round((target_calories * (macro_fat_pct / 100)) / 9)

    # Activity progress context
    total_steps = activities_summary.get("total_steps", 0)
    total_duration = activities_summary.get("total_workout_minutes", 0)
    sessions = activities_summary.get("activity_records", 0)

    if sessions > 0 and total_steps > target_steps:
        personalized_feedback = f"Great work! You have logged {sessions} session(s) with over {total_steps:,} total steps. You are exceeding your base targets!"
    elif sessions > 0:
        personalized_feedback = f"You have logged {sessions} workout session(s) totaling {total_duration} minutes. Keep this momentum rolling!"
    else:
        personalized_feedback = "Welcome! Log your first workout session to start receiving personalized progress adjustments."

    return {
        "status": "success",
        "user_profile": {
            "username": user.username,
            "goal": goal,
            "weight_kg": weight,
            "height_cm": height,
            "bmi": bmi,
            "bmi_category": bmi_category,
        },
        "daily_targets": {
            "target_calories": target_calories,
            "target_steps": target_steps,
            "target_workout_minutes": target_workout_minutes,
            "bmr": bmr,
            "tdee": tdee,
        },
        "macronutrient_split": {
            "protein": {"grams": protein_grams, "percentage": macro_protein_pct},
            "carbohydrates": {"grams": carbs_grams, "percentage": macro_carb_pct},
            "fats": {"grams": fat_grams, "percentage": macro_fat_pct},
        },
        "ai_workout_plan": {
            "focus": workout_focus,
            "routine": workout_routine,
        },
        "ai_nutrition_plan": {
            "tips": meal_tips,
        },
        "coach_insights": {
            "headline": f"AI Coach Plan for {goal}",
            "advice": coach_message,
            "progress_feedback": personalized_feedback,
        },
    }
