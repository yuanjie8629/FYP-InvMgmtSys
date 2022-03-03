from django.db import models

from customer.models import CustType

# Create your models here.


class Voucher(models.Model):
    voucher_id = models.IntegerField(primary_key=True)
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
    last_update = models.DateTimeField()

    class Meta:
        db_table = "voucher"


class VoucherLine(models.Model):
    voucher_line_id = models.IntegerField(primary_key=True)
    voucher = models.ForeignKey(Voucher, on_delete=models.CASCADE)
    cust_type = models.ForeignKey(CustType, on_delete=models.CASCADE)

    class Meta:
        db_table = "voucher_line"
