from rest_framework import serializers
from postcode.models import State
from postcode.serializers import PostcodeSerializer
from shipment.models import Pickup, PickupLoc, Shipment, ShippingFee


class ShippingFeeSerializer(serializers.ModelSerializer):
    location = serializers.SlugRelatedField(
        slug_field="name", queryset=State.objects.all()
    )

    class Meta:
        model = ShippingFee
        exclude = ["created_at", "is_deleted"]


class PickupLocSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupLoc
        fields = ["id", "location"]


class PickupSerializer(serializers.ModelSerializer):
    location = serializers.SlugRelatedField(
        slug_field="location", queryset=PickupLoc.objects.all(), source="pickup_loc"
    )

    class Meta:
        model = Pickup
        exclude = [
            "created_at",
            "last_update",
            "polymorphic_ctype",
            "type",
            "is_deleted",
            "pickup_loc",
        ]


class ShipmentSerializer(serializers.ModelSerializer):
    postcode = PostcodeSerializer(read_only=True)

    class Meta:
        model = Shipment
        exclude = [
            "created_at",
            "last_update",
            "type",
            "is_deleted",
            "polymorphic_ctype",
        ]
