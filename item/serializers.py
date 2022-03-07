from rest_framework import serializers
from core.serializers import ChoiceField
import item
from item.models import PROD_CAT, Item, Product


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        exclude = ["type"]


class ItemPrevSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["item_id", "name", "price", "sku", "status", "stock", "thumbnail"]


class ProductSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["type"]

    def create(self, validated_data):
        item_data = validated_data.pop("item")
        item = Item.objects.create(**item_data, type="prod")
        product = Product.objects.create(item=item, **validated_data)
        return product

    def update(self, instance, validated_data):
        item_data = validated_data.pop("item")
        keys = []
        item_keys = []
        for key in validated_data:
            setattr(instance, key, validated_data[key])
            keys.append(key)
        instance.save(update_fields=keys)

        item = Item.objects.get(pk=instance.pk)
        for key in item_data:
            setattr(item, key, item_data[key])
            item_keys.append(key)
        item.save(update_fields=item_keys)

        return instance

    def to_representation(self, instance):
        product = super().to_representation(instance)
        item = product.pop("item")
        for key, value in item.items():
            product[key] = value
        return product


class ProductPrevSerializer(serializers.ModelSerializer):
    item = ItemPrevSerializer()

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
