from django.db import models
from customer.models import CustAcc
from item.models import Item
from voucher.models import Voucher

# Create your models here.
class Order(models.Model):
    order_id = models.IntegerField(primary_key=True)
    created_tms = models.DateTimeField()
    total_amt = models.DecimalField(max_digits=10, decimal_places=2)
    ship_type = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    cust = models.ForeignKey(CustAcc, on_delete=models.DO_NOTHING)
    voucher = models.ForeignKey(
        Voucher, on_delete=models.DO_NOTHING, blank=True, null=True
    )

    class Meta:
        db_table = "order"


class OrderLine(models.Model):
    order_line_id = models.IntegerField(primary_key=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "order_line"


class OrderShipment(models.Model):
    order_ship_id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=20)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "order_shipment"
