from django_filters import rest_framework as filters
from .models import Product


class ProductFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="item__name", lookup_expr="icontains")
    sku = filters.CharFilter(field_name="item__sku", lookup_expr="icontains")
    status = filters.CharFilter(field_name="item__status")
    min_price = filters.NumberFilter(field_name="item__price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="item__price", lookup_expr="lte")
    min_stock = filters.NumberFilter(field_name="item__stock", lookup_expr="gte")
    max_stock = filters.NumberFilter(field_name="item__stock", lookup_expr="lte")

    ordering = filters.OrderingFilter(
        fields=(
            ("item__name", "name"),
            ("item__sku", "sku"),
            ("item__price", "price"),
            ("item__stock", "stock"),
        )
    )

    class Meta:
        model = Product
        fields = ["category"]
