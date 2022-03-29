from django_filters import rest_framework as filters
from order.models import Order


class OrderFilter(filters.FilterSet):
    id = filters.CharFilter(field_name="id", lookup_expr="icontains")
    cust_name = filters.CharFilter(field_name="cust__name", lookup_expr="icontains")
    email = filters.CharFilter(field_name="email", lookup_expr="icontains")
    track_num = filters.CharFilter(
        field_name="shipment__shipment__track_num", lookup_expr="icontains"
    )
    cust_type = filters.CharFilter(field_name="cust__cust_type__type")
    status = filters.CharFilter(field_name="status")
    payment_method = filters.CharFilter(field_name="payment__method")
    order_date_before = filters.DateFilter(
        field_name="created_at", input_formats=["%d-%m-%Y"], lookup_expr="lte"
    )
    order_date_after = filters.DateFilter(
        field_name="created_at", input_formats=["%d-%m-%Y"], lookup_expr="gte"
    )
    min_amount = filters.NumberFilter(field_name="total_amt", lookup_expr="gte")
    max_amount = filters.NumberFilter(field_name="total_amt", lookup_expr="lte")

    ordering = filters.OrderingFilter(
        fields=(
            ("id", "id"),
            ("cust__name", "cust_name"),
            ("cust__cust_type__type", "cust_type"),
            ("shipment__shipment__track_num", "track_num"),
            ("email", "email"),
            ("created_at", "order_time"),
            ("total_amt", "total_amt"),
        )
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "cust",
            "email",
            "shipment",
            "payment",
            "created_at",
            "total_amt",
            "status",
        ]
