from datetime import date
from django.db import models
from django.core.validators import MinValueValidator
from polymorphic.models import PolymorphicModel
from core.models import PolySoftDeleteModel
from image.models import Image
from item.choices import ITEM_STATUS, ITEM_TYPE, PROD_CAT
from uuid import uuid4
from cloudinary.models import CloudinaryField
from django.db.models import Avg, Sum, F


def upload_to(instance, filename):
    # upload_to = "{}/{}".format(instance.type, instance.name)
    return "thumbnails/{}.{}".format(uuid4().hex, filename.split(".")[-1])


class Item(PolySoftDeleteModel, PolymorphicModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False)
    type = models.CharField(max_length=20, choices=ITEM_TYPE)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=ITEM_STATUS)
    # thumbnail = models.ImageField(upload_to=upload_to)
    thumbnail = CloudinaryField("image", width_field="700", height_field="700")
    image = models.ManyToManyField(
        Image,
        through="ImageItemLine",
        related_name="item",
        blank=True,
        max_length=8,
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    special_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
    )
    sku = models.CharField(max_length=45, unique=True)
    stock = models.PositiveIntegerField()
    weight = models.DecimalField(
        max_digits=8, decimal_places=2, validators=[MinValueValidator(0)]
    )
    length = models.DecimalField(
        max_digits=8, decimal_places=2, validators=[MinValueValidator(0)]
    )
    width = models.DecimalField(
        max_digits=8, decimal_places=2, validators=[MinValueValidator(0)]
    )
    height = models.DecimalField(
        max_digits=8, decimal_places=2, validators=[MinValueValidator(0)]
    )

    class Meta:
        db_table = "item"

    def __str__(self):
        return "{} ({})".format(self.name, self.type)

    def save(self, *args, **kwargs):
        if self.stock <= 0 and self.status == "active":
            self.status = "oos"
        if self.stock > 0 and self.status == "oos":
            self.status = "active"

        super(Item, self).save(*args, **kwargs)
        return self


class Product(Item):
    category = models.CharField(max_length=30, choices=PROD_CAT)
    cost_per_unit = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    ordering_cost = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    holding_cost = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    avg_lead_tm = models.IntegerField(blank=True, null=True)
    max_lead_tm = models.IntegerField(blank=True, null=True)

    def __init__(self, *args, **kwargs):
        super(Product, self).__init__(*args, **kwargs)
        self.type = "prod"

    class Meta:
        db_table = "product"


class Package(Item):
    avail_start_dt = models.DateField()
    avail_end_dt = models.DateField(blank=True, null=True, default=date.max)
    product = models.ManyToManyField(
        Product, through="PackageItem", related_name="package"
    )

    def __init__(self, *args, **kwargs):
        super(Package, self).__init__(*args, **kwargs)
        self.type = "pack"

    class Meta:
        db_table = "package"

    def save(self, *args, **kwargs):
        if (
            self.avail_start_dt is not None
            and self.avail_start_dt > date.today()
            and self.status != "hidden"
        ):
            self.status = "scheduled"
        if (
            self.avail_end_dt is not None
            and self.avail_end_dt < date.today()
            and self.status != "hidden"
        ):
            self.status = "expired"

        super(Package, self).save(*args, **kwargs)
        return self


class PackageItem(models.Model):
    id = models.AutoField(primary_key=True)
    quantity = models.IntegerField(blank=True, null=True)
    pack = models.ForeignKey(
        Package, on_delete=models.CASCADE, related_name="pack_item"
    )
    prod = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="pack_item"
    )

    class Meta:
        db_table = "package_item"


class ImageItemLine(models.Model):
    id = models.AutoField(primary_key=True)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "image_item_line"
