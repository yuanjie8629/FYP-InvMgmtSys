from rest_framework import serializers
from postcode.models import State
from shipment.models import PickupLoc, ShippingFee


class ShippingFeeSerializer(serializers.ModelSerializer):
    location = serializers.SlugRelatedField(
        slug_field="name", queryset=State.objects.all()
    )
    

    def create(self, validated_data):
        return super().create(validated_data)
    class Meta:
        model = ShippingFee
        exclude = ["created_at", "is_deleted"]

class PickupLocSerializer(serializers.ModelSerializer):
    class Meta:
        model=PickupLoc
        fields="__all__"