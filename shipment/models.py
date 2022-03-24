from django.db import models
from address.models import Address
from core.models import SoftDeleteModel
from order.models import Order
from postcode.models import State


class ShippingFee(SoftDeleteModel):

    id = models.AutoField(primary_key=True)
    location = models.ForeignKey(State, on_delete=models.DO_NOTHING)
    weight_start = models.IntegerField()
    weight_end = models.IntegerField()
    ship_fee = models.DecimalField(max_digits=10, decimal_places=2)
    sub_fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    sub_weight = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "shipping_fee"


class Shipment(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    track_num = models.CharField(max_length=50)
    address = models.ForeignKey(Address, on_delete=models.DO_NOTHING)
    ship_fee = models.ForeignKey(ShippingFee, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipment"
