from django.dispatch import receiver
from django.db.models.signals import post_save
from item.models import Item
from notification.models import Notification

# @receiver(pre_save, sender=OrderLine)
# def deduct_product_quantity(sender, instance, **kwargs):
#     item = instance.item
#     if item.stock <= 0 or instance.quantity > item.stock:
#         raise serializers.ValidationError({"detail": "no_stock"})
#     item.stock = item.stock - instance.quantity
#     item.save()


@receiver(post_save, sender=Item)
def low_stock_notification(sender, instance, **kwargs):
    if instance.stock <= 15:
        title = "Low Stock"
        description = "<p><span>{} is currently in low stock.</span></p><p><span>Please consider restocking it.</span></p>".format(instance.name)
        type = 'product' if instance.type == 'prod' else 'package'
        Notification.objects.create(title=title, description=description, type=type)
