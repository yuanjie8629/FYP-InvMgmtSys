from django.db import models
from customer.models import CustAcc

from item.models import Item

# Create your models here.
class Cart(models.Model):
    cart_id = models.IntegerField(primary_key=True)
    created_tms = models.DateTimeField()
    last_update = models.DateTimeField()
    cust = models.ForeignKey(CustAcc, on_delete=models.CASCADE)

    class Meta:
        db_table = "cart"


class CartItem(models.Model):
    cart_item_id = models.IntegerField(primary_key=True)
    quantity = models.IntegerField()
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "cart_item"