import datetime
from django_filters import rest_framework as filters
from django_property_filter import (
    PropertyFilterSet,
    PropertyNumberFilter,
    PropertyDateTimeFilter,
    PropertyOrderingFilter,
)
from django_property_filter.utils import get_value_for_db_field
from .models import Cust, CustPosReg

# class CustomPropertyOrderingFilter(PropertyOrderingFilter):
#     def sorted_pk_list_from_property(self, sort_property, queryset):
#         """Sorting the primary key list of the given queryset based on the given property."""
#         # Identify the sort order
#         descending = False
#         if sort_property.startswith("-"):
#             descending = True
#             sort_property = sort_property[1:]

#         # Build a list of pk and value, this might become very large depending on data type
#         # Need to use a list because set will loose order
#         value_list = []
#         is_datetime = False
#         is_date = False
#         for obj in queryset:
#             property_value = get_value_for_db_field(obj, sort_property)
#             is_datetime = (
#                 True if isinstance(property_value, datetime.datetime) else False
#             )
#             is_date = True if isinstance(property_value, datetime.date) else False
#             value_list.append((obj.pk, property_value))

#         mindatetime = datetime.datetime(datetime.MINYEAR, 1, 1)
#         mindate = datetime.datetime(datetime.MINYEAR, 1, 1)

#         cmp = lambda x: x[1]
#         if is_datetime:
#             cmp = lambda x: x[1] or mindatetime
#         elif is_date:
#             cmp = lambda x: x[1] or mindate
#         # Sort the list of tuples
#         value_list = sorted(
#             value_list,
#             key=cmp,
#             reverse=descending,
#         )

#         # Get a list of sorted primary keys
#         value_list = [entry[0] for entry in value_list]

#         print(value_list)

#         return value_list


class CustFilter(PropertyFilterSet):
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
    min_order_value_per_month = PropertyNumberFilter(
        field_name="get_order_value_per_month", lookup_expr="gte"
    )
    max_order_value_per_month = PropertyNumberFilter(
        field_name="get_order_value_per_month", lookup_expr="lte"
    )
    last_order_dt_before = PropertyDateTimeFilter(
        field_name="get_last_order_dt", input_formats=["%d-%m-%Y"], lookup_expr="lte"
    )
    last_order_dt_after = PropertyDateTimeFilter(
        field_name="get_last_order_dt", input_formats=["%d-%m-%Y"], lookup_expr="gte"
    )

    ordering = filters.OrderingFilter(
        fields=(
            ("id", "id"),
            ("name", "name"),
            ("cust_type", "type"),
            ("date_joined", "date_joined"),
        )
    )

    order_ordering = PropertyOrderingFilter(
        fields=(
            ("get_order_value_per_month", "order_value_per_month"),
            ("get_last_order_dt_datetime", "last_order_dt"),
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
            "order",
        ]


class CustPosRegFilter(filters.FilterSet):
    id = filters.CharFilter(field_name="id", lookup_expr="icontains")
    type = filters.CharFilter(field_name="position__type")
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    email = filters.CharFilter(field_name="email", lookup_expr="icontains")
    contact_num = filters.CharFilter(field_name="phone_num", lookup_expr="icontains")
    accept = filters.BooleanFilter(field_name="accept")
    pending = filters.BooleanFilter(field_name="accept", lookup_expr="isnull")
    created_at_before = filters.DateFilter(
        field_name="created_at", input_formats=["%d-%m-%Y"], lookup_expr="lte"
    )
    created_at_after = filters.DateFilter(
        field_name="created_at", input_formats=["%d-%m-%Y"], lookup_expr="gte"
    )

    ordering = filters.OrderingFilter(
        fields=("id", "name", "email", "phone_num", "created_at", "gender", "position")
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
