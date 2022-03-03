from rest_framework import serializers
from core.serializers import ChoiceField
from item.models import PROD_CAT, Item, Product


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class ItemPrevSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["name", "price", "sku", "status", "stock", "thumbnail"]


class ProductSerializer(serializers.ModelSerializer):
    item = ItemSerializer()
    type = ChoiceField(choices=("prod",'Product'))
    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["type"]

    def create(self, validated_data):
        item_data = validated_data.pop("item")
        item = Item.objects.create(**item_data)
        product = Product.objects.create(item=item, **validated_data)
        return product

    def to_representation(self, instance):
        product = super().to_representation(instance)
        item = product.pop("item")
        for key, value in item.items():
            product[key] = value
        return product


class ProductPrevSerializer(serializers.ModelSerializer):
    item = ItemPrevSerializer()
    category = ChoiceField(choices=PROD_CAT)

    class Meta:
        model = Product
        fields = ["category", "item"]
        read_only_fields = ["type"]

    def to_representation(self, instance):
        product = super().to_representation(instance)
        item = product.pop("item")
        for key, value in item.items():
            product[key] = value
        return product
