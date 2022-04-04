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


class HMLAnalysisResultSerializer(ABCAnalysisSerializer):
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