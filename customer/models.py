from django.db import models
from core.choices import GENDER_CHOICES
from core.models import Users


class Cust(Users):
    cust_type = models.ForeignKey(
        "CustType", on_delete=models.DO_NOTHING, related_name="cust"
    )
    pos_reg = models.ForeignKey(
        "CustPosReg", on_delete=models.DO_NOTHING, blank=True, null=True
    )

    class Meta:
        db_table = "cust"

    def __init__(self, *args, **kwargs):
        super(Cust, self).__init__(*args, **kwargs)
        self.cust_type = CustType.objects.get(type="cust")


class CustPosReg(models.Model):
    id = models.AutoField(primary_key=True)
    ic_num = models.CharField(max_length=15)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birthdate = models.DateField()
    address = models.CharField(max_length=255)
    position = models.CharField(max_length=30)
    marital_status = models.CharField(max_length=20)
    occupation = models.CharField(max_length=45, blank=True, null=True)
    comp_name = models.CharField(max_length=100, blank=True, null=True)
    reg_dt = models.DateTimeField()
    accept = models.IntegerField()
    # postal = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "cust_pos_reg"


class CustType(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = "cust_type"
