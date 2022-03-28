from django.db import models
from core.models import SoftDeleteModel

from order.models import Order
from payment.choices import PAYMENT_METHOD


class Payment(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField()
    reference_num = models.CharField(max_length=50)
    order = models.ForeignKey(
        Order, on_delete=models.DO_NOTHING, related_name="payment"
    )

    class Meta:
        db_table = "payment"
