from django.db import models
from core.models import BaseModel
from customer.models import Cust
from item.models import Item


class Wishlist(BaseModel):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_created=True)
    cust = models.ForeignKey(Cust, on_delete=models.CASCADE)
    item = models.ManyToManyField(Item, through="WishlistItem")

    class Meta:
        db_table = "wishlist"


class WishlistItem(models.Model):
    id = models.AutoField(primary_key=True)
    wishlist = models.ForeignKey(Wishlist, models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "wishlist_item"
