from django.db import models
from customer.models import CustAcc

from item.models import Item

# Create your models here.
class Review(models.Model):
    review_id = models.IntegerField(primary_key=True)
    rating = models.IntegerField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    created_tms = models.DateTimeField(blank=True, null=True)
    cust = models.ForeignKey(
        CustAcc, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    item = models.ForeignKey(Item, on_delete=models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = "review"
