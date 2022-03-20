from enum import auto
from django.db import models
from core.models import SoftDeleteModel
from customer.models import Cust
from item.models import Item
from voucher.models import Voucher


class Order(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
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
    id = models.AutoField(primary_key=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "order_line"
