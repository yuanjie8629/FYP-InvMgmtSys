from django.db import models
from core.models import SoftDeleteModel

from customer.models import CustType

class Voucher(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    min_spend = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    max_discount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    total_amt = models.IntegerField()
    usage_limit = models.IntegerField()
    avail_start_tm = models.DateTimeField()
    avail_end_tm = models.DateTimeField(blank=True, null=True)
    cust_type = models.ManyToManyField(CustType, through='VoucherLine')
    class Meta:
        db_table = "voucher"


class VoucherLine(models.Model):
    id = models.IntegerField(primary_key=True)
    voucher = models.ForeignKey(Voucher, on_delete=models.CASCADE)
    cust_type = models.ForeignKey(CustType, on_delete=models.CASCADE)

    class Meta:
        db_table = "voucher_line"
