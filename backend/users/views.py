from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum

from .models import FitnessActivity
from .serializers import (
    RegistrationSerializer,
    ProfileSerializer,
    FitnessActivitySerializer
)


class RegisterView(APIView):

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)

        return Response(serializer.data)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request):
        profile = request.user.profile

        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class BMIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile

        height_m = profile.height / 100

        if height_m <= 0 or profile.weight <= 0:
            return Response(
                {"error": "Height and weight must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST
            )

        bmi_value = profile.weight / (height_m ** 2)

        if bmi_value < 18.5:
            category = "Underweight"
        elif bmi_value < 25:
            category = "Healthy weight"
        elif bmi_value < 30:
            category = "Overweight"
        else:
            category = "Obesity"

        return Response({
            "weight": profile.weight,
            "height": profile.height,
            "bmi": round(bmi_value, 2),
            "category": category
        })


class FitnessActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        activities = FitnessActivity.objects.filter(user=request.user).order_by("-activity_date", "-id")
        serializer = FitnessActivitySerializer(activities, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = FitnessActivitySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class FitnessActivityDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            activity = FitnessActivity.objects.get(pk=pk, user=request.user)
        except FitnessActivity.DoesNotExist:
            return Response(
                {"error": "Activity record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = FitnessActivitySerializer(activity)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            activity = FitnessActivity.objects.get(pk=pk, user=request.user)
        except FitnessActivity.DoesNotExist:
            return Response(
                {"error": "Activity record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        activity.delete()
        return Response(
            {"message": "Activity record deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )


class FitnessSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        activities = FitnessActivity.objects.filter(user=request.user)
        count = activities.count()

        summary = activities.aggregate(
            total_steps=Sum("steps"),
            total_workout_minutes=Sum("workout_duration"),
            total_calories_burned=Sum("calories_burned")
        )

        total_steps = summary["total_steps"] or 0
        total_workout_minutes = summary["total_workout_minutes"] or 0
        total_calories_burned = summary["total_calories_burned"] or 0

        avg_steps = round(total_steps / count, 1) if count > 0 else 0
        avg_workout = round(total_workout_minutes / count, 1) if count > 0 else 0
        avg_calories = round(total_calories_burned / count, 1) if count > 0 else 0

        latest = activities.order_by("-activity_date").first()

        return Response({
            "total_steps": total_steps,
            "total_workout_minutes": total_workout_minutes,
            "total_calories_burned": total_calories_burned,
            "activity_records": count,
            "average_steps": avg_steps,
            "average_workout_minutes": avg_workout,
            "average_calories_burned": avg_calories,
            "latest_activity_date": latest.activity_date if latest else None
        })
