from dataclasses import fields
from unicodedata import category
from uuid import uuid4
from django.conf import settings
from django.http import QueryDict
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.decorators import parser_classes
from rest_framework import serializers
from core.serializers import ChoiceField
from image.models import Image
from image.serializers import ImageSerializer
from item.choices import PROD_CAT
from item.models import ImageItemLine, Item, Package, PackageItem, Product


def check_sku(value, *args, **kwargs):
    compare = kwargs.get("compare")
    check_query = Item.objects.filter(sku=value)
    if check_query.exists():
        if not compare or compare != value:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "invalid_sku",
                        "message": "Item with this SKU already exists.",
                    }
                }
            )
    return value


# @receiver(post_save, sender=Item)
# def check_stock(sender, instance, *args, **kwargs):
#     instance.refresh_from_db()
#     print(instance.stock)
#     if instance.stock <= 0 and instance.status == "active":
#         instance.status = "oos"
#         instance.save(update_fields=["status"])
#         print("Update status to oos")

#     if instance.stock > 0 and instance.status == "oos":
#         instance.status = "active"
#         instance.save(update_fields=["status"])
#         print("Update status to active due to restock")


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        exclude = [
            "is_deleted",
            "polymorphic_ctype",
            "created_at",
            "last_update",
        ]


class ProductListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        ret = []
        for i in instance:
            for data in validated_data:
                if i.id == data.get("id"):
                    for key, value in data.items():
                        if key == "id":
                            continue

                        setattr(i, key, value)
                    break
            ret.append(i.save())
        return ret


class ProductSerializer(serializers.ModelSerializer):
    image = ImageSerializer(many=True, required=False)

    class Meta:
        model = Product
        exclude = [
            "type",
            "is_deleted",
            "polymorphic_ctype",
            "created_at",
            "last_update",
        ]
        extra_kwargs = {
            "sku": {"validators": []},
        }
        list_serializer_class = ProductListSerializer

    def create(self, validated_data):
        if "sku" in validated_data:
            check_sku(validated_data.get("sku"))
        images = validated_data.pop("image", None)
        product = Product.objects.create(**validated_data)
        if images:
            for image_data in images:
                image = Image.objects.create(**image_data)
                product.image.add(image)
        return product

    def update(self, instance, validated_data):
        if "sku" in validated_data:
            check_sku(validated_data.get("sku"), compare=instance.sku)
        images = validated_data.pop("image", None)

        for key in validated_data:
            setattr(instance, key, validated_data[key])

        instance.save()

        if images:
            for image_data in images:
                image = Image.objects.create(**image_data)
                instance.image.add(image)

        return instance


class ProductPrevSerializer(serializers.ModelSerializer):
    category = ChoiceField(choices=PROD_CAT)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "sku",
            "status",
            "stock",
            "thumbnail",
            "category",
        ]


class PackageSerializer(serializers.ModelSerializer):
    image = ImageSerializer(many=True, required=False)
    product = ProductSerializer(many=True)
    avail_start_tm = serializers.DateTimeField(input_formats=["%d-%m-%Y"])
    avail_end_tm = serializers.DateTimeField(input_formats=["%d-%m-%Y"], required=False)

    class Meta:
        model = Package
        exclude = [
            "type",
            "is_deleted",
            "polymorphic_ctype",
            "created_at",
            "last_update",
        ]
        extra_kwargs = {
            "sku": {"validators": []},
        }

    def create(self, validated_data):
        if "sku" in validated_data:
            check_sku(validated_data.get("sku"))
        images = validated_data.pop("image", None)
        product = Product.objects.create(**validated_data)
        for image_data in images:
            image = Image.objects.create(**image_data)
            product.image.add(image)
        return product

    def update(self, instance, validated_data):
        if "sku" in validated_data:
            check_sku(validated_data.get("sku"), compare=instance.sku)
        images = validated_data.pop("image", None)

        for key in validated_data:
            setattr(instance, key, validated_data[key])

        instance.save()

        if images:
            for image_data in images:
                image = Image.objects.create(**image_data)
                instance.image.add(image)

        return instance


class PackagePrevSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = [
            "id",
            "name",
            "price",
            "sku",
            "status",
            "stock",
            "thumbnail",
        ]
