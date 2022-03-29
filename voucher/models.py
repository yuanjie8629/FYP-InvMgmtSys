from datetime import date
from django.db import models
from core.models import SoftDeleteModel
from customer.models import CustType
from voucher.choices import VOUCHER_STATUS


class Voucher(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=VOUCHER_STATUS)
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
    auto_apply = models.BooleanField(default=False)
    avail_start_dt = models.DateField()
    avail_end_dt = models.DateField(blank=True, null=True, default=date.max)
    cust_type = models.ManyToManyField(CustType, through="VoucherLine")

    class Meta:
        db_table = "voucher"

    def __str__(self):
        return "{}".format(self.code)

    def save(self, *args, **kwargs):
        if self.total_amt == 0 and self.status == "active":
            self.status = "oos"

        if self.total_amt > 0 and self.status == "oos":
            self.status = "active"

        if (
            self.avail_start_dt is not None
            and self.avail_start_dt > date.today()
            and self.status != "hidden"
        ):
            self.status = "scheduled"

        if (
            self.avail_end_dt is not None
            and self.avail_end_dt < date.today()
            and self.status != "hidden"
        ):
            self.status = "expired"

        super(Voucher, self).save(*args, **kwargs)
        return self


class VoucherLine(models.Model):
    id = models.AutoField(primary_key=True)
    voucher = models.ForeignKey(
        Voucher, on_delete=models.CASCADE, related_name="voucher_line"
    )
    cust_type = models.ForeignKey(
        CustType, on_delete=models.CASCADE, related_name="voucher_line"
    )

    class Meta:
        db_table = "voucher_line"

    def __str__(self):
        return "{}: {}".format(self.voucher.code, self.cust_type.type)
