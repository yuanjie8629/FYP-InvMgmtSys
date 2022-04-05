from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Admin


class AdminSerializer(serializers.ModelSerializer):
    birthdate = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", required=False
    )

    class Meta:
        model = Admin
        fields = (
            "id",
            "name",
            "username",
            "email",
            "phone_num",
            "birthdate",
            "gender",
            "is_superuser",
        )

    def update(self, instance, validated_data):
        username = validated_data.get("username", None)
        if username:
            if Admin.objects.filter(username=username).exists():
                raise serializers.ValidationError(
                    detail={
                        "error": {
                            "code": "username_exists",
                            "message": "The username already exists. Please use another username.",
                        }
                    }
                )

        email = validated_data.get("email", None)

        if email:
            if Admin.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    detail={
                        "error": {
                            "code": "email_exists",
                            "message": "The email already exists. Please use another email.",
                        }
                    }
                )

        return super().update(instance, validated_data)


class ChangePassSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    new_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Admin
        fields = (
            "password",
            "new_password",
        )

    def update(self, instance, validated_data):
        print("setting new password.")
        instance.set_password(validated_data.get("new_password"))
        instance.save()
        return instance
