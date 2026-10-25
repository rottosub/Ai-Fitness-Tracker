from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User, Profile, FitnessActivity


class FitnessTrackerAPITests(APITestCase):

    def setUp(self):
        # Create a test user and profile
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123"
        )
        self.profile = Profile.objects.create(
            user=self.user,
            age=24,
            height=180.0,
            weight=75.0,
            goal="Weight Loss"
        )

        # Login to obtain JWT
        login_url = reverse("token_obtain_pair")
        response = self.client.post(login_url, {
            "username": "testuser",
            "password": "testpassword123"
        })
        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_registration_success(self):
        url = reverse("register")
        payload = {
            "username": "newrunner",
            "email": "newrunner@example.com",
            "password": "strongpassword123",
            "age": 28,
            "height": 172.5,
            "weight": 68.0,
            "goal": "Cardio & Endurance"
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newrunner").exists())
        self.assertTrue(Profile.objects.filter(user__username="newrunner").exists())

    def test_registration_validation_error(self):
        url = reverse("register")
        payload = {
            "username": "invaliduser",
            "email": "invalid@example.com",
            "password": "pw",
            "age": -5,  # Invalid age
            "height": 170.0,
            "weight": 65.0,
            "goal": "Keep Fit"
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_get_and_patch(self):
        url = reverse("profile")
        # GET profile
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["age"], 24)

        # PATCH profile
        patch_payload = {"weight": 73.5, "goal": "Muscle Building"}
        patch_response = self.client.patch(url, patch_payload)
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_response.data["weight"], 73.5)
        self.assertEqual(patch_response.data["goal"], "Muscle Building")

    def test_bmi_calculation(self):
        url = reverse("bmi")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("bmi", response.data)
        self.assertIn("category", response.data)
        # 75 kg / (1.8m ^ 2) = 23.15 -> Healthy weight
        self.assertEqual(response.data["category"], "Healthy weight")

    def test_activity_logging_and_summary(self):
        activities_url = reverse("activities")
        summary_url = reverse("fitness-summary")

        # Log an activity
        activity_data = {
            "steps": 8000,
            "workout_duration": 45,
            "calories_burned": 400,
            "activity_date": "2026-10-24"
        }
        create_res = self.client.post(activities_url, activity_data)
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        activity_id = create_res.data["id"]

        # Check summary
        summary_res = self.client.get(summary_url)
        self.assertEqual(summary_res.status_code, status.HTTP_200_OK)
        self.assertEqual(summary_res.data["total_steps"], 8000)
        self.assertEqual(summary_res.data["total_workout_minutes"], 45)
        self.assertEqual(summary_res.data["total_calories_burned"], 400)
        self.assertEqual(summary_res.data["activity_records"], 1)

        # Delete activity
        detail_url = reverse("activity-detail", kwargs={"pk": activity_id})
        delete_res = self.client.delete(detail_url)
        self.assertEqual(delete_res.status_code, status.HTTP_204_NO_CONTENT)

        # Verify summary reflects deletion
        summary_res2 = self.client.get(summary_url)
        self.assertEqual(summary_res2.data["activity_records"], 0)

    def test_ai_recommendations_endpoint(self):
        url = reverse("ai-recommendations")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("daily_targets", response.data)
        self.assertIn("ai_workout_plan", response.data)
        self.assertIn("macronutrient_split", response.data)
        self.assertIn("coach_insights", response.data)
        self.assertTrue(len(response.data["ai_workout_plan"]["routine"]) > 0)
