from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    age = models.PositiveIntegerField()
    height = models.FloatField()
    weight = models.FloatField()
    goal = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username}'s Profile"