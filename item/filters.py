from django_filters import rest_framework as filters
from .models import Package, Product


class ProductFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    sku = filters.CharFilter(field_name="sku", lookup_expr="icontains")
    status = filters.CharFilter(field_name="status")
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_stock = filters.NumberFilter(field_name="stock", lookup_expr="gte")
    max_stock = filters.NumberFilter(field_name="stock", lookup_expr="lte")

    ordering = filters.OrderingFilter(
        fields=(
            "name",
            "sku",
            "price",
            "stock",
        )
    )

    class Meta:
        model = Product
        fields = ["name", "sku", "status", "price", "stock"]


class PackageFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    sku = filters.CharFilter(field_name="sku", lookup_expr="icontains")
    status = filters.CharFilter(field_name="status")
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_stock = filters.NumberFilter(field_name="stock", lookup_expr="gte")
    max_stock = filters.NumberFilter(field_name="stock", lookup_expr="lte")

    ordering = filters.OrderingFilter(
        fields=(
            "name",
            "sku",
            "price",
            "stock",
        )
    )

    class Meta:
        model = Package
        fields = ["name", "sku", "status", "price", "stock"]
