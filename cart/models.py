from django.db import models
from core.models import SoftDeleteModel
from customer.models import Cust

from item.models import Item

# Create your models here.
class Cart(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    cust = models.ForeignKey(Cust, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item, through="CartItem")

    class Meta:
        db_table = "cart"


class CartItem(models.Model):
    id = models.AutoField(primary_key=True)
    quantity = models.PositiveIntegerField()
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "cart_item"
