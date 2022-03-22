from django_filters import rest_framework as filters
from .models import Cust


class CustFilter(filters.FilterSet):
    id = filters.NumberFilter(field_name="id")
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    is_active = filters.CharFilter(field_name="is_active")
    birthdate_start = filters.DateFilter(
        field_name="birthdate", lookup_expr="gte", input_formats=["%d-%m-%Y"]
    )
    birthdate_end = filters.DateFilter(
        field_name="birthdate", lookup_expr="lte", input_formats=["%d-%m-%Y"]
    )

    ordering = filters.OrderingFilter(
        fields=(
            "name",
            "sku",
            "price",
            "stock",
        )
    )

    class Meta:
        model = Cust
        fields = ["id","name", "sku", "status", "price", "stock"]