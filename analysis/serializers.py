from django.forms import IntegerField
from rest_framework import serializers
from core.serializers import ChoiceField
from item.choices import PROD_CAT
from item.models import Product


class ABCAnalysisSerializer(serializers.ModelSerializer):
    id = IntegerField()
    category = ChoiceField(choices=PROD_CAT, read_only=True)
    thumbnail = serializers.ImageField(read_only=True)
    name = serializers.CharField(read_only=True)
    sku = serializers.CharField(read_only=True)
    cost_per_unit = serializers.DecimalField(max_digits=10, decimal_places=2)
    demand = serializers.IntegerField()
    consumption_value = serializers.DecimalField(max_digits=10, decimal_places=4)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "cost_per_unit",
            "thumbnail",
            "category",
            "demand",
            "consumption_value",
        ]


class ABCAnalysisResultSerializer(ABCAnalysisSerializer):
    thumbnail = serializers.URLField(read_only=True)
    demand_percent = serializers.DecimalField(max_digits=10, decimal_places=4)
    consumption_value_percent = serializers.DecimalField(
        max_digits=10, decimal_places=4
    )
    grade = serializers.CharField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "cost_per_unit",
            "thumbnail",
            "category",
            "demand",
            "consumption_value",
            "demand_percent",
            "consumption_value_percent",
            "grade",
        ]


class HMLAnalysisSerializer(serializers.ModelSerializer):
    id = IntegerField()
    category = ChoiceField(choices=PROD_CAT, read_only=True)
    thumbnail = serializers.ImageField(read_only=True)
    name = serializers.CharField(read_only=True)
    sku = serializers.CharField(read_only=True)
    stock = serializers.IntegerField(read_only=True)
    cost_per_unit = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "stock",
            "cost_per_unit",
            "thumbnail",
            "category",
        ]


class HMLAnalysisResultSerializer(HMLAnalysisSerializer):
    thumbnail = serializers.URLField(read_only=True)
    cost_per_unit_percent = serializers.DecimalField(max_digits=10, decimal_places=4)
    grade = serializers.CharField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "stock",
            "cost_per_unit",
            "thumbnail",
            "category",
            "cost_per_unit_percent",
            "grade",
        ]


class EOQAnalysisSerializer(serializers.ModelSerializer):
    id = IntegerField()
    category = ChoiceField(choices=PROD_CAT, read_only=True)
    thumbnail = serializers.ImageField(read_only=True)
    name = serializers.CharField(read_only=True)
    sku = serializers.CharField(read_only=True)
    demand = serializers.IntegerField(read_only=True)
    ordering_cost = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    holding_cost = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "thumbnail",
            "category",
            "demand",
            "ordering_cost",
            "holding_cost",
        ]


class EOQAnalysisResultSerializer(EOQAnalysisSerializer):
    thumbnail = serializers.URLField(read_only=True)
    optimal_order_qty = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "thumbnail",
            "category",
            "demand",
            "ordering_cost",
            "holding_cost",
            "optimal_order_qty",
        ]


class SSAnalysisSerializer(serializers.ModelSerializer):
    id = IntegerField()
    category = ChoiceField(choices=PROD_CAT, read_only=True)
    thumbnail = serializers.ImageField(read_only=True)
    name = serializers.CharField(read_only=True)
    sku = serializers.CharField(read_only=True)
    avg_demand = serializers.IntegerField(read_only=True)
    max_demand = serializers.IntegerField(read_only=True)
    avg_lead_tm = serializers.IntegerField(read_only=True)
    max_lead_tm = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "thumbnail",
            "category",
            "avg_demand",
            "max_demand",
            "avg_lead_tm",
            "max_lead_tm",
        ]


class SSAnalysisResultSerializer(SSAnalysisSerializer):
    thumbnail = serializers.URLField(read_only=True)
    safety_stock = serializers.IntegerField(read_only=True)
    reorder_point = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "thumbnail",
            "category",
            "avg_demand",
            "max_demand",
            "avg_lead_tm",
            "max_lead_tm",
            "safety_stock",
            "reorder_point",
        ]
