from django.db import models
from core.models import PolySoftDeleteModel, SoftDeleteModel
from postcode.models import Postcode, State
from polymorphic.models import PolymorphicModel
from shipment.choices import SHIPMENT_TYPE


class ShippingFee(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    location = models.ForeignKey(State, on_delete=models.DO_NOTHING)
    weight_start = models.DecimalField(max_digits=8, decimal_places=2)
    weight_end = models.DecimalField(max_digits=8, decimal_places=2)
    ship_fee = models.DecimalField(max_digits=10, decimal_places=2)
    sub_fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    sub_weight = models.DecimalField(max_digits=8, decimal_places=2,blank=True, null=True)

    class Meta:
        db_table = "shipping_fee"
    
    def __str__(self):
        return "{}: {}g - {}g, RM {}".format(self.location.name, self.weight_start,self.weight_end,self.ship_fee)


class OrderShipment(PolySoftDeleteModel, PolymorphicModel):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20, choices=SHIPMENT_TYPE)

    class Meta:
        db_table = "order_shipment"
    
    def __str__(self):
        return "{}: {}".format(self.id, self.type)


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
    
    def __str__(self):
        return "{} - {} ({})".format("Shipment",self.pk,  self.track_num)


class PickupLoc(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    location = models.CharField(max_length=80)

    class Meta:
        db_table = "pickup_loc"
    
    def __str__(self):
        return "{}".format(self.location)


class Pickup(OrderShipment):
    contact_name = models.CharField(max_length=100)
    contact_num = models.CharField(max_length=15)
    pickup_dt = models.DateTimeField(blank=True, null=True)
    pickup_loc = models.ForeignKey(PickupLoc, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "pickup"

    def __init__(self, *args, **kwargs):
        super(Pickup, self).__init__(*args, **kwargs)
        self.type = "pickup"
    
    def __str__(self):
         return "{} - {} ({})".format("Pickup",self.pk,  self.pickup_loc)



