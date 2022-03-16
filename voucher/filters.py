from django_filters import rest_framework as filters

from customer.models import CustType
from .models import Voucher


class VoucherFilter(filters.FilterSet):
    code = filters.CharFilter(field_name="code", lookup_expr="icontains")
    status = filters.CharFilter(field_name="status")
    min_discount = filters.NumberFilter(field_name="discount", lookup_expr="gte")
    max_discount = filters.NumberFilter(field_name="discount", lookup_expr="lte")
    min_avail = filters.NumberFilter(field_name="total_amt", lookup_expr="gte")
    max_avail = filters.NumberFilter(field_name="total_amt", lookup_expr="lte")
    avail_start_dt = filters.DateFilter(
        field_name="avail_start_dt", lookup_expr="gte", input_formats=["%d-%m-%Y"]
    )
    avail_end_dt = filters.DateFilter(
        field_name="avail_end_dt",
        lookup_expr="lte",
        input_formats=["%d-%m-%Y"],
    )
    type = filters.CharFilter(field_name="cust_type__type")
    ordering = filters.OrderingFilter(
        fields=("code", "discount", "total_amt", "avail_start_dt", "avail_end_dt")
    )

    class Meta:
        model = Voucher
        fields = [
            "code",
            "status",
            "total_amt",
            "discount",
            "type",
            "avail_start_dt",
            "avail_end_dt",
        ]