from rest_framework import serializers
from core.serializers import ChoiceField
from image.models import Image
from image.serializers import ImageSerializer
from item.choices import PROD_CAT
from item.models import Item, Package, PackageItem, Product


def check_sku(value, *args, **kwargs):
    compare = kwargs.get("compare")
    check_query = Item.objects_with_deleted.filter(sku=value)
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
            ret.append(i.save())
        return ret



class ProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    image = ImageSerializer(many=True, required=False)
    thumbnail = serializers.ImageField()

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
        print(validated_data)
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
    thumbnail = serializers.ImageField()

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


class PackageItemSerializer(serializers.ModelSerializer):
    id = serializers.SlugRelatedField(slug_field="id", source="prod", read_only=True)
    name = serializers.SlugRelatedField(
        slug_field="name", source="prod", read_only=True
    )
    sku = serializers.SlugRelatedField(slug_field="sku", source="prod", read_only=True)
    price = serializers.SlugRelatedField(
        slug_field="price", source="prod", read_only=True
    )
    thumbnail = serializers.ImageField(source="prod.thumbnail")
    category = serializers.SlugRelatedField(
        slug_field="category", source="prod", read_only=True
    )

    class Meta:
        model = PackageItem
        fields = ["quantity", "id", "name", "sku", "price", "thumbnail", "category"]


class PackageSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField()
    image = ImageSerializer(many=True, required=False)
    product = PackageItemSerializer(many=True, source="pack_item", read_only=True)
    avail_start_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    avail_end_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", required=False
    )

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


class PackageListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        ret = []
        for i in instance:
            for data in validated_data:
                if i.id == data.get("id"):
                    for key, value in data.items():
                        if key == "id":
                            continue
                        setattr(i, key, value)
            ret.append(i.save())
        return ret


class PackageWriteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    image = ImageSerializer(many=True, required=False)
    product = serializers.ListField(child=serializers.ListField(), write_only=True)
    thumbnail = serializers.ImageField()
    avail_start_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    avail_end_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", required=False
    )

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
        list_serializer_class = PackageListSerializer

    def create(self, validated_data):
        if "sku" in validated_data:
            check_sku(validated_data.get("sku"))

        products = validated_data.pop("product", None)

        if products is None:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "require_product",
                        "message": "Please add at least ONE product.",
                    }
                }
            )

        images = validated_data.pop("image", None)

        for prod in products:
            products = prod

        product_ids = [prod.get("id") for prod in products]

        product_list = Product.objects.filter(id__in=product_ids)
        final_products = []
        for prod_obj in product_list:
            for prod in products:
                if str(prod_obj.id) == prod.get("id"):
                    final_products.append(
                        {"prod": prod_obj, "quantity": prod.get("quantity")}
                    )

        package = Package.objects.create(**validated_data)
        for prod_data in final_products:
            PackageItem.objects.create(**prod_data, pack=package)

        if images:
            for image_data in images:
                image = Image.objects.create(**image_data)
                package.image.add(image)

        return package

    def update(self, instance, validated_data):
        if "sku" in validated_data:
            check_sku(validated_data.get("sku"), compare=instance.sku)

        products = validated_data.pop("product", None)

        if products is None:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "require_product",
                        "message": "Please add at least ONE product.",
                    }
                }
            )

        images = validated_data.pop("image", None)

        for prod in products:
            products = prod

        product_ids = [prod.get("id") for prod in products]

        product_list = Product.objects.filter(id__in=product_ids)
        final_products = []
        for prod_obj in product_list:
            for prod in products:
                if str(prod_obj.id) == prod.get("id"):
                    final_products.append(
                        {"prod": prod_obj, "quantity": prod.get("quantity")}
                    )
        for key in validated_data:
            setattr(instance, key, validated_data[key])

        instance.save()
        PackageItem.objects.filter(pack=instance).delete()
        for prod_data in final_products:
            PackageItem.objects.create(**prod_data, pack=instance)

        if images:
            for image_data in images:
                image = Image.objects.create(**image_data)
                instance.image.add(image)

        return instance


class PackagePrevSerializer(serializers.ModelSerializer):
    product = PackageItemSerializer(many=True, source="pack_item")
    thumbnail = serializers.ImageField()

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
            "product",
        ]
