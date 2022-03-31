from dataclasses import field
from django_filters import rest_framework as filters
from shipment.models import PickupLoc, ShippingFee


class ShippingFeeFilter(filters.FilterSet):
    location = filters.CharFilter(field_name="location__name", lookup_expr="icontains")
    min_weight = filters.NumberFilter(field_name="weight_start", lookup_expr="gte")
    max_weight = filters.NumberFilter(field_name="weight_end", lookup_expr="lte")
    min_ship_fee = filters.NumberFilter(field_name="ship_fee", lookup_expr="gte")
    max_ship_fee = filters.NumberFilter(field_name="ship_fee", lookup_expr="lte")

    ordering = filters.OrderingFilter(
        fields=(
            "location",
            "weight_start",
            "weight_end",
            "ship_fee",
        )
    )

    class Meta:
        model = ShippingFee
        fields = ["location", "weight_start", "weight_end", "ship_fee"]


class PickupLocFilter(filters.FilterSet):
    location = filters.CharFilter(field_name="location", lookup_expr="icontains")

    ordering = filters.OrderingFilter(fields=("location",))

    class Meta:
        model = PickupLoc
        fields = ["location"]
