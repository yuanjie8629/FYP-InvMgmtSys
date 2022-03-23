from django_filters import rest_framework as filters
from .models import Cust, CustPosReg


class CustFilter(filters.FilterSet):
    id = filters.CharFilter(field_name="id", lookup_expr="icontains")
    type = filters.CharFilter(field_name="cust_type__type")
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    email = filters.CharFilter(field_name="email", lookup_expr="icontains")
    is_active = filters.BooleanFilter(field_name="is_active")
    joined_date_before = filters.DateFilter(
        field_name="date_joined", input_formats=["%d-%m-%Y"], lookup_expr="lte"
    )
    joined_date_after = filters.DateFilter(
        field_name="date_joined", input_formats=["%d-%m-%Y"], lookup_expr="gte"
    )

    ordering = filters.OrderingFilter(
        fields=(
            "id",
            "name",
            "cust_type",
            "date_joined",
        )
    )

    class Meta:
        model = Cust
        fields = [
            "id",
            "name",
            "email",
            "cust_type",
            "is_active",
            "date_joined",
        ]


class CustPosRegFilter(filters.FilterSet):
    id = filters.CharFilter(field_name="id", lookup_expr="icontains")
    type = filters.CharFilter(field_name="position__type")
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    email = filters.CharFilter(field_name="email", lookup_expr="icontains")
    contact_num = filters.CharFilter(field_name="phone_num", lookup_expr="icontains")
    accept = filters.BooleanFilter(field_name="accept")
    registration_date_before = filters.DateFilter(
        field_name="created_at", input_formats=["%d-%m-%Y"], lookup_expr="lte"
    )
    registration_date_after = filters.DateFilter(
        field_name="created_at", input_formats=["%d-%m-%Y"], lookup_expr="gte"
    )

    ordering = filters.OrderingFilter(
        fields=("id", "name", "email", "phone_num", "registration_date", "gender")
    )

    class Meta:
        model = CustPosReg
        fields = [
            "id",
            "name",
            "email",
            "gender",
            "phone_num",
            "position",
            "accept",
            "created_at",
        ]
