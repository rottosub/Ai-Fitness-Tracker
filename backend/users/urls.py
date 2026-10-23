from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    FitnessActivityView,
    FitnessActivityDetailView,
    BMIView,
    FitnessSummaryView
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("activities/", FitnessActivityView.as_view(), name="activities"),
    path("activities/<int:pk>/", FitnessActivityDetailView.as_view(), name="activity-detail"),
    path("summary/", FitnessSummaryView.as_view(), name="fitness-summary"),
    path("bmi/", BMIView.as_view(), name="bmi"),
]
