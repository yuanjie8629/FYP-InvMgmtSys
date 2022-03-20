from django.db import models
from core.models import SoftDeleteModel
from customer.models import Cust

from item.models import Item
from order.models import Order


class Review(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    rating = models.IntegerField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    cust = models.ForeignKey(Cust, on_delete=models.DO_NOTHING, blank=True, null=True)
    item = models.ForeignKey(Item, on_delete=models.DO_NOTHING, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "review"
