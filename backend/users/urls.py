from django.urls import path
from .views import RegisterView, ProfileView, FitnessActivityView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("activities/", FitnessActivityView.as_view(), name="activities"),
]