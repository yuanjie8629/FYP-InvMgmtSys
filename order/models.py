from enum import auto
import random
import string
from django.db import models
from core.models import SoftDeleteModel
from customer.models import Cust
from item.models import Item
from order.choices import ORDER_STATUS
from shipment.models import OrderShipment
from voucher.models import Voucher


class Order(SoftDeleteModel):
    id = models.CharField(primary_key=True, max_length=40)
    total_amt = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, blank=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    cust = models.ForeignKey(Cust, on_delete=models.DO_NOTHING, blank=True, null=True)
    voucher = models.ForeignKey(
        Voucher, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, default=0
    )
    item = models.ManyToManyField(Item, through="OrderLine")
    shipment = models.ForeignKey(
        OrderShipment, on_delete=models.DO_NOTHING, related_name="order"
    )

    class Meta:
        db_table = "order"

    def save(self, *args, **kwargs):
        if self.id is None:
            self.id = self.create_unique_id()
        if self.status is None:
            self.status = "unpaid"
        super(Order, self).save(*args, **kwargs)
        return self

    def create_id(self):
        return "".join(random.choices(string.digits, k=15))

    def create_unique_id(self):
        id = self.create_id()
        unique = False
        while not unique:
            if not Order.objects.filter(pk=id).exists():
                return id
            else:
                id = self.create_id()


class OrderLine(models.Model):
    id = models.AutoField(primary_key=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="order_line"
    )
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="order_line")

    class Meta:
        db_table = "order_line"
