from django.db import models
from customer.models import CustAcc

from item.models import Item
from order.models import Order

# Create your models here.
class Review(models.Model):
    id = models.IntegerField(primary_key=True)
    rating = models.IntegerField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_created=True)
    cust = models.ForeignKey(
        CustAcc, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    item = models.ForeignKey(Item, on_delete=models.DO_NOTHING, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)
    class Meta:
        db_table = "review"
