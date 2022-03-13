from django.db import models

from order.models import Order

# Create your models here.
class Payment(models.Model):
    id = models.IntegerField(primary_key=True)
    method = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.IntegerField()
    reference_num = models.CharField(max_length=50)
    created_tms = models.DateTimeField()
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "payment"
