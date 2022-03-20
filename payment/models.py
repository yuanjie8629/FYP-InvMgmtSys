from django.db import models
from core.models import SoftDeleteModel

from order.models import Order

class Payment(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    method = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField()
    reference_num = models.CharField(max_length=50)
    created_tms = models.DateTimeField()
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "payment"
