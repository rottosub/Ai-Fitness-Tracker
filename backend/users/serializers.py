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

    def validate_age(self, value):
        if value <= 0 or value > 120:
            raise serializers.ValidationError("Age must be between 1 and 120.")
        return value

    def validate_height(self, value):
        if value <= 0 or value > 300:
            raise serializers.ValidationError("Height must be a positive number in cm.")
        return value

    def validate_weight(self, value):
        if value <= 0 or value > 500:
            raise serializers.ValidationError("Weight must be a positive number in kg.")
        return value

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
    bmi = serializers.SerializerMethodField()
    bmi_category = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'username',
            'email',
            'age',
            'height',
            'weight',
            'goal',
            'bmi',
            'bmi_category',
        ]

    def get_bmi(self, obj):
        height_m = obj.height / 100.0
        if height_m <= 0:
            return 0
        return round(obj.weight / (height_m ** 2), 2)

    def get_bmi_category(self, obj):
        bmi = self.get_bmi(obj)
        if bmi < 18.5:
            return "Underweight"
        elif bmi < 25:
            return "Healthy weight"
        elif bmi < 30:
            return "Overweight"
        return "Obesity"

    def validate_age(self, value):
        if value <= 0 or value > 120:
            raise serializers.ValidationError("Age must be between 1 and 120.")
        return value

    def validate_height(self, value):
        if value <= 0 or value > 300:
            raise serializers.ValidationError("Height must be positive.")
        return value

    def validate_weight(self, value):
        if value <= 0 or value > 500:
            raise serializers.ValidationError("Weight must be positive.")
        return value


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

    def validate_steps(self, value):
        if value < 0:
            raise serializers.ValidationError("Steps cannot be negative.")
        return value

    def validate_workout_duration(self, value):
        if value < 0:
            raise serializers.ValidationError("Workout duration cannot be negative.")
        return value

    def validate_calories_burned(self, value):
        if value < 0:
            raise serializers.ValidationError("Calories burned cannot be negative.")
        return value
