from rest_framework import serializers
from .models import User, Profile, FitnessActivity

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    age = serializers.IntegerField()
    height = serializers.FloatField()
    weight = serializers.FloatField()
    goal = serializers.CharField()

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'age',
            'height',
            'weight',
            'goal',
        ]

    def create(self, validated_data):
        age = validated_data.pop("age")
        height = validated_data.pop("height")
        weight = validated_data.pop("weight")
        goal = validated_data.pop("goal")

        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"]
        )

        user.set_password(validated_data["password"])
        user.save()

        Profile.objects.create(
            user=user,
            age=age,
            height=height,
            weight=weight,
            goal=goal
        )

        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username',
        read_only=True
    )
    email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    class Meta:
        model = Profile
        fields = [
            'username',
            'email',
            'age',
            'height',
            'weight',
            'goal',
        ]

class FitnessActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = FitnessActivity
        fields = [
            'id',
            'steps',
            'workout_duration',
            'calories_burned',
            'activity_date',
        ]
        read_only_fields = ['id']