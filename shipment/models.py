from django.db import models
from address.models import ShippingAddress

from order.models import OrderShipment

# Create your models here.
class Shipment(models.Model):
    ship = models.OneToOneField(
        OrderShipment, on_delete=models.CASCADE, primary_key=True
    )
    created_tms = models.DateTimeField()
    track_num = models.CharField(max_length=50)
    address = models.ForeignKey(ShippingAddress, on_delete=models.DO_NOTHING)
    ship_fee = models.ForeignKey("ShippingFee", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipment"


class Pickup(models.Model):
    pickup = models.OneToOneField(
        OrderShipment, on_delete=models.CASCADE, primary_key=True
    )
    pickup_dt = models.DateTimeField()
    pickup_loc = models.ForeignKey("PickupLoc", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "pickup"


class PickupLoc(models.Model):
    id = models.IntegerField(primary_key=True)
    location = models.CharField(max_length=50)

    class Meta:
        db_table = "pickup_loc"


class ShippingFee(models.Model):
    id = models.IntegerField(primary_key=True)
    location = models.CharField(max_length=45)
    weight_start = models.DecimalField(max_digits=8, decimal_places=2)
    weight_end = models.DecimalField(max_digits=8, decimal_places=2)
    ship_fee = models.DecimalField(max_digits=10, decimal_places=2)
    courier = models.ForeignKey("Courier", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipping_fee"


class Courier(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "courier"
