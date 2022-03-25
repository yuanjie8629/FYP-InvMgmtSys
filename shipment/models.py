from django.db import models
from address.models import Address
from core.models import PolySoftDeleteModel, SoftDeleteModel
from order.models import Order
from postcode.models import State
from polymorphic.models import PolymorphicModel

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


class OrderShipment(PolySoftDeleteModel, PolymorphicModel):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "order_shipment"


class Shipment(OrderShipment):
    track_num = models.CharField(max_length=50)
    address = models.ForeignKey(Address, on_delete=models.DO_NOTHING)
    ship_fee = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "shipment"


class Pickup(OrderShipment):
    pickup_dt = models.DateTimeField()
    pickup_loc = models.ForeignKey("PickupLoc", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "pickup"


class PickupLoc(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    location = models.CharField(max_length=50)

    class Meta:
        db_table = "pickup_loc"