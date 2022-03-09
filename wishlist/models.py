from django.db import models
from core.models import BaseModel
from customer.models import CustAcc

from item.models import Item

# Create your models here.
class Wishlist(BaseModel):
    wishlist_id = models.IntegerField(primary_key=True)
    created_tms = models.DateTimeField()
    cust = models.ForeignKey(CustAcc, on_delete=models.CASCADE)

    class Meta:
        db_table = "wishlist"


class WishlistItem(models.Model):
    wishlist_item_id = models.IntegerField(primary_key=True)
    wishlist = models.ForeignKey(Wishlist, models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "wishlist_item"
