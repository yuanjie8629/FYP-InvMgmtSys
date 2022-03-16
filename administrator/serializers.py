from dataclasses import field
from rest_framework import serializers
from .models import Admin


class AdminSerializer(serializers.ModelSerializer):
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
