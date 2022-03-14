from dataclasses import fields
from uuid import uuid4
from django.conf import settings
from django.http import QueryDict
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework import serializers
from core.serializers import ChoiceField
from core.utils import dict_to_querydict
from image.serializers import ImageSerializer
from item.choices import PROD_CAT
from item.models import ImageItemLine, Item, Package, PackageItem, Product


def getItemRepresentation(instance):
    item = instance.pop("item", None)
    for key, value in item.items():
        instance[key] = value
    return instance


def parseItemData(data, type):
    # Handle multipart form
    if isinstance(data, QueryDict):
        return parseQueryDict(data, type)

    data = data.copy()
    item_data = {}
    type_data = {}
    image_data = {}
    for key in data:
        if hasattr(Item, key):
            item_data[key] = data[key]

        if hasattr(type, key):
            type_data[key] = data[key]

    data.clear()
    data.update({"item": item_data, **type_data})
    return data


def parseQueryDict(data, type):
    new_data = {}
    num = 0
    for key in data:
        if hasattr(Item, key):
            new_data["item." + key] = data[key]
        elif hasattr(type, key):
            new_data[key] = data[key]
        else:
            new_data["item.image[{}]".format(str(num))] = {"image": data[key]}
            num += 1

    new_data["item.type"] = "prod" if isinstance(type(type), Product) else "pack"
    return dict_to_querydict(new_data)


class ItemSerializer(serializers.ModelSerializer):
    image = ImageSerializer(many=True, required=False)

    class Meta:
        model = Item
        exclude = ["created_at", "last_update", "is_deleted"]
        write_only = ["type"]
        extra_kwargs = {
            "sku": {"validators": []},
        }

    def create(self, validated_data):
        if "sku" in validated_data:
            self.check_sku(validated_data.get("sku"))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "sku" in validated_data and instance.sku != validated_data.get("sku"):
            self.check_sku(validated_data.get("sku"))
        return super().update(instance, validated_data)

    def check_sku(self, value):
        check_query = Item.objects.filter(sku=value)
        if check_query.exists():
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


class ItemPrevSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name", "price", "sku", "status", "stock", "thumbnail"]


class ProductListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        # items = [i.item for i in instance]
        data = validated_data.copy()
        prodFields = []
        itemFields = []

        for data in validated_data:
            itemFields.extend([*data.pop("item").keys()])
            prodFields.extend([*data.keys()])

        for i in instance:
            if prodFields:
                # Product.objects.bulk_update(instance, prodFields, batch_size=100)
                i.save(update_fields=prodFields)
            if itemFields:
                # Item.objects.bulk_update(items, itemFields, batch_size=100)
                i.item.save(update_fields=itemFields)

        return instance


class ProductSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = Product
        fields = "__all__"
        list_serializer_class = ProductListSerializer

    def create(self, validated_data):

        item_data = validated_data.pop("item", None)

        image_data = item_data.pop("image", None)

        # batch_size= 100
        # objs = (Image(image=i) for i in image_data)
        # while True:
        #     batch = list(islice(objs, batch_size))
        #     if not batch:
        #         break
        #     image = Image.objects.bulk_create(objs, batch_size)

        item_serializer = ItemSerializer(data=item_data)
        item_serializer.is_valid(raise_exception=True)
        item = item_serializer.save()
        product = Product.objects.create(item=item, **validated_data)

        if image_data:
            for image_datum in image_data:
                image_serializer = ImageSerializer(data=image_datum)
                image_serializer.is_valid(raise_exception=True)
                img = image_serializer.save()

                ImageItemLine.objects.create(item=item, image=img)

        return product

    def update(self, instance, validated_data):
        item_data = validated_data.pop("item", None)
        image_data = item_data.pop("image", None)
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

        if image_data:
            for image_datum in image_data:
                image_serializer = ImageSerializer(data=image_datum)
                image_serializer.is_valid(raise_exception=True)
                img = image_serializer.save()

                ImageItemLine.objects.create(item=item, image=img)
        return instance

    def to_representation(self, instance):
        product = super().to_representation(instance)
        return getItemRepresentation(product)

    def to_internal_value(self, data):
        return super().to_internal_value(parseItemData(data, Product))


class ProductPrevSerializer(serializers.ModelSerializer):
    item = ItemPrevSerializer()
    category = ChoiceField(choices=PROD_CAT)

    class Meta:
        model = Product
        fields = ["category", "item"]
        read_only_fields = ["type"]

    def to_representation(self, instance):
        product = super().to_representation(instance)
        return getItemRepresentation(product)


class PackageListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        # items = [i.item for i in instance]
        data = validated_data.copy()
        packFields = []
        itemFields = []

        for data in validated_data:
            itemFields.extend([*data.pop("item").keys()])
            packFields.extend([*data.keys()])

        for i in instance:
            if packFields:
                # Package.objects.bulk_update(instance, prodFields, batch_size=100)
                i.save(update_fields=packFields)
            if itemFields:
                # Item.objects.bulk_update(items, itemFields, batch_size=100)
                i.item.save(update_fields=itemFields)

        return instance


class PackageProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="prod.item_id")
    name = serializers.CharField(source="prod.item.name")
    thumbnail = serializers.ImageField(source="prod.item.thumbnail")

    class Meta:
        model = PackageItem
        fields = ["id", "name", "quantity", "thumbnail"]


class PackageSerializer(serializers.ModelSerializer):
    item = ItemSerializer()
    product = PackageProductSerializer(many=True, source="pack_item")

    class Meta:
        model = Package
        fields = "__all__"
        read_only_fields = ["type"]

        list_serializer_class = PackageListSerializer

    def create(self, validated_data):

        item_data = validated_data.pop("item", None)
        product_data = validated_data.pop("products", None)
        image_data = item_data.pop("image", None)

        # batch_size= 100
        # objs = (Image(image=i) for i in image_data)
        # while True:
        #     batch = list(islice(objs, batch_size))
        #     if not batch:
        #         break
        #     image = Image.objects.bulk_create(objs, batch_size)

        item_serializer = ItemSerializer(data=item_data)
        item_serializer.is_valid(raise_exception=True)
        item = item_serializer.save()
        package = Package.objects.create(item=item, **validated_data)

        if product_data:
            for prod_datum in product_data:
                prod = Product.objects.get(id=prod_datum.id)
                PackageItem.objects.create(pack=package, prod=prod)

        if image_data:
            for image_datum in image_data:
                image_serializer = ImageSerializer(data=image_datum)
                image_serializer.is_valid(raise_exception=True)
                img = image_serializer.save()

                ImageItemLine.objects.create(item=item, image=img)

        return package

    def update(self, instance, validated_data):
        item_data = validated_data.pop("item", None)
        image_data = item_data.pop("image", None)
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

        if image_data:
            for image_datum in image_data:
                image_serializer = ImageSerializer(data=image_datum)
                image_serializer.is_valid(raise_exception=True)
                img = image_serializer.save()
                ImageItemLine.objects.create(item=item, image=img)
        return instance

    def to_representation(self, instance):
        package = super().to_representation(instance)
        return getItemRepresentation(package)

    def to_internal_value(self, data):
        return super().to_internal_value(parseItemData(data, Package))


class PackagePrevSerializer(serializers.ModelSerializer):
    item = ItemPrevSerializer()
    product = PackageProductSerializer(many=True, source="pack_item")

    class Meta:
        model = Package
        fields = "__all__"

    def to_representation(self, instance):
        package = super().to_representation(instance)
        return getItemRepresentation(package)
