from django.db import models
from core.models import SoftDeleteModel, Users
from postcode.models import Postcode


class Address(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=100)
    contact_num = models.CharField(max_length=15)
    default = models.BooleanField(blank=True, null=True)
    postcode = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)
    cust = models.ForeignKey(Users, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "address"

    def __str__(self):
        return "({}) {}".format(self.cust.email, self.address)
