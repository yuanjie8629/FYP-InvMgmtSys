from django.db import models
from address.models import ShippingAddress
from core.models import PolySoftDeleteModel, SoftDeleteModel
from polymorphic.models import PolymorphicModel
from order.models import Order


class OrderShipment(PolySoftDeleteModel, PolymorphicModel):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "order_shipment"


class Shipment(OrderShipment):
    track_num = models.CharField(max_length=50)
    address = models.ForeignKey(ShippingAddress, on_delete=models.DO_NOTHING)
    ship_fee = models.ForeignKey("ShippingFee", on_delete=models.DO_NOTHING)

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


class Courier(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "courier"


class ShippingFee(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    location = models.CharField(max_length=45)
    weight_start = models.DecimalField(max_digits=8, decimal_places=2)
    weight_end = models.DecimalField(max_digits=8, decimal_places=2)
    ship_fee = models.DecimalField(max_digits=10, decimal_places=2)
    courier = models.ForeignKey(Courier, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipping_fee"
