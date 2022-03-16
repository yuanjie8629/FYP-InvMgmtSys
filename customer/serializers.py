from dataclasses import field
from rest_framework import serializers
from customer.models import CustType


class CustTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustType
        fields = "__all__"
