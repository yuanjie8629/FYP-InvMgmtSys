from rest_framework import serializers
from core.serializers import ChoiceField
from image.serializers import ImageSerializer
from item.choices import PROD_CAT
from item.models import ImageItemLine, Item, Product
from image.models import Image
from itertools import islice


class ItemSerializer(serializers.ModelSerializer):
    image = ImageSerializer(many=True, required=False)

    class Meta:
        model = Item
        exclude = ["type", "created_at", "last_update", "is_deleted"]


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
        image_data = item_data.pop("image") if "image" in item_data else None

        # batch_size= 100
        # objs = (Image(image=i) for i in image_data)
        # while True:
        #     batch = list(islice(objs, batch_size))
        #     if not batch:
        #         break
        #     image = Image.objects.bulk_create(objs, batch_size)

        item = Item.objects.create(**item_data, type="prod")
        product = Product.objects.create(item=item, **validated_data)

        if image_data:
            for image_datum in image_data:
                image = Image.objects.create(**image_datum)
                ImageItemLine.objects.create(item=item, image=image)

        return product

    def update(self, instance, validated_data):
        item_data = validated_data.pop("item")
        image_data = item_data.pop("image")
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
