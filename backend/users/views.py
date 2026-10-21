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
        activities = FitnessActivity.objects.filter(user=request.user)
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

class FitnessSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        activities = FitnessActivity.objects.filter(user=request.user)

        summary = activities.aggregate(
            total_steps=Sum('steps'),
            total_workout_minutes=Sum('workout_duration'),
            total_calories_burned=Sum('calories_burned')
        )

        return Response({
            "total_steps": summary["total_steps"] or 0,
            "total_workout_minutes": summary["total_workout_minutes"] or 0,
            "total_calories_burned": summary["total_calories_burned"] or 0,
            "activity_records": activities.count()
        })