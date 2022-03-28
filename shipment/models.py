from django.db import models
from core.models import PolySoftDeleteModel, SoftDeleteModel
from postcode.models import Postcode, State
from polymorphic.models import PolymorphicModel
from shipment.choices import SHIPMENT_TYPE


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
    type = models.CharField(max_length=20, choices=SHIPMENT_TYPE)

    class Meta:
        db_table = "order_shipment"


class Shipment(OrderShipment):
    track_num = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=100)
    contact_num = models.CharField(max_length=15)
    postcode = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)
    ship_fee = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "shipment"

    def __init__(self, *args, **kwargs):
        super(Shipment, self).__init__(*args, **kwargs)
        self.type = "shipping"


class Pickup(OrderShipment):
    contact_name = models.CharField(max_length=100)
    contact_num = models.CharField(max_length=15)
    pickup_dt = models.DateTimeField(blank=True, null=True)
    pickup_loc = models.ForeignKey("PickupLoc", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "pickup"

    def __init__(self, *args, **kwargs):
        super(Pickup, self).__init__(*args, **kwargs)
        self.type = "pickup"


class PickupLoc(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    location = models.CharField(max_length=50)

    class Meta:
        db_table = "pickup_loc"
