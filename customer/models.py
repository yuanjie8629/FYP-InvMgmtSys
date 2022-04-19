import datetime
from django.db import models
from django.db.models import Sum
from core.choices import GENDER_CHOICES
from core.models import SoftDeleteModel, Users
from customer.choices import MARITAL_STATUS
from postcode.models import Postcode


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
        if not self.cust_type:
            self.cust_type = CustType.objects.get(type="cust")

    @property
    def get_order_value_per_month(self):
        if self.order.all().exists():
            order_list = self.order.all().filter(
                created_at__month=datetime.datetime.now().month
            )
            total_amt = order_list.aggregate(Sum("total_amt")).get("total_amt__sum")
            if total_amt:
                return total_amt
            else:
                return 0
        else:
            return 0

    @property
    def get_last_order_dt(self):
        if self.order.all().exists():
            return self.order.all().order_by("-created_at").first().created_at
        else:
            return None

    @property
    def get_last_order_dt_datetime(self):
        if self.order.all().exists():
            return self.order.all().order_by("-created_at").first().created_at
        else:
            return datetime.datetime(datetime.MINYEAR, 1, 1)


class CustPosReg(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS)
    email = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birthdate = models.DateField()
    address = models.CharField(max_length=255)
    postcode = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)
    position = models.ForeignKey("CustType", on_delete=models.DO_NOTHING)
    occupation = models.CharField(max_length=45)
    comp_name = models.CharField(max_length=100, blank=True, null=True)
    accept = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = "cust_pos_reg"

    def __str__(self):
        return "{}, {} ({})".format(self.name, self.email, self.position.type)


class CustType(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = "cust_type"
