from django.db import models
from customer.models import CustAcc
from postcode.models import Postcode

# Create your models here.


class ShippingAddress(models.Model):
    address_id = models.IntegerField(primary_key=True)
    address = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=100)
    contact_num = models.CharField(max_length=15)
    default = models.IntegerField(blank=True, null=True)
    postal = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)
    cust = models.ForeignKey(CustAcc, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipping_address"
