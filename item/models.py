from django.db import models
from django.core.validators import MinValueValidator
from simple_history.models import HistoricalRecords
from core.models import SoftDeleteModel
from item.choices import ITEM_STATUS, ITEM_TYPE, PROD_CAT


class Item(SoftDeleteModel):

    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=ITEM_TYPE)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=ITEM_STATUS)
    thumbnail = models.URLField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    sku = models.CharField(max_length=45, unique=True)
    stock = models.IntegerField(validators=[MinValueValidator(0)])
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    length = models.DecimalField(max_digits=8, decimal_places=2)
    width = models.DecimalField(max_digits=8, decimal_places=2)
    height = models.DecimalField(max_digits=8, decimal_places=2)
    history = HistoricalRecords(
        table_name="item_history",
        excluded_fields=["created_at", "last_update", "is_deleted"],
    )

    class Meta:
        db_table = "item"
     

    def __str__(self):
        return "{}: {}".format(self.type, self.name)


class Product(models.Model):

    item = models.OneToOneField(
        Item, on_delete=models.CASCADE, primary_key=True, related_name="product"
    )

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
    history = HistoricalRecords(table_name="product_history")

    class Meta:
        db_table = "product"
       


class Package(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, primary_key=True)
    avail_start_tm = models.DateTimeField()
    avail_end_tm = models.DateTimeField(blank=True, null=True)
    history = HistoricalRecords(table_name="package_history")

    class Meta:
        db_table = "package"


class PackageItem(models.Model):
    pack_item_id = models.IntegerField(primary_key=True)
    quantity = models.IntegerField(blank=True, null=True)
    pack = models.ForeignKey(Package, on_delete=models.CASCADE)
    prod = models.ForeignKey("Product", on_delete=models.CASCADE)
    history = HistoricalRecords(table_name="package_item_history")

    class Meta:
        db_table = "package_item"
