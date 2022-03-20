from enum import auto
from django.db import models
from customer.models import Cust
from item.models import Item
from voucher.models import Voucher

# Create your models here.
class Order(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_created=True)
    total_amt = models.DecimalField(max_digits=10, decimal_places=2)
    ship_type = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    cust = models.ForeignKey(Cust, on_delete=models.DO_NOTHING)
    voucher = models.ForeignKey(
        Voucher, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    item = models.ManyToManyField(Item, through="OrderLine")

    class Meta:
        db_table = "order"


class OrderLine(models.Model):
    id = models.IntegerField(primary_key=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "order_line"


class OrderShipment(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=20)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "order_shipment"
