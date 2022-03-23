from rest_framework import serializers
from postcode.models import State
from shipment.models import ShippingFee


class ShippingFeeSerializer(serializers.ModelSerializer):
    location = serializers.SlugRelatedField(
        slug_field="name", queryset=State.objects.all()
    )

    class Meta:
        model = ShippingFee
        exclude = ["created_at", "is_deleted"]
