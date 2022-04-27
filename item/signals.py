import datetime
from django.dispatch import receiver
from django.db.models.signals import post_save
from item.models import Item, Package
from notification.models import Notification

# @receiver(pre_save, sender=OrderLine)
# def deduct_product_quantity(sender, instance, **kwargs):
#     item = instance.item
#     if item.stock <= 0 or instance.quantity > item.stock:
#         raise serializers.ValidationError({"detail": "no_stock"})
#     item.stock = item.stock - instance.quantity
#     item.save()


@receiver(post_save, sender=Package)
def check_package_status(sender, instance, **kwargs):
    if (
        instance.avail_start_dt <= datetime.date.today()
        and instance.avail_end_dt >= datetime.date.today()
        and instance.status != "active"
    ):
        instance.status = "active"
        instance.save()
        print("active")

    if (
        instance.avail_start_dt <= datetime.date.today()
        and instance.status == "scheduled"
    ):
        instance.status = "active"
        instance.save()
        print("active")

    if instance.avail_end_dt < datetime.date.today() and instance.status == "active":
        instance.status = "expired"
        instance.save()
        print("expired")
    return


@receiver(post_save, sender=Item)
def low_stock_notification(sender, instance, **kwargs):
    type = "product" if instance.type == "prod" else "package"
    if instance.stock == 10:
        title = "Low Stock"
        description = "<span style={}>{} is currently in low stock.<br/>Please consider restocking it.</span>".format(
            "word-wrap:break-word", instance.name
        )

        Notification.objects.create(title=title, description=description, type=type)

    if instance.stock == 0:
        title = "Out of Stock"
        description = "<span style={}>{} is out of stock!<br/>It is not available for sale until it is restocked.</span>".format(
            "word-wrap:break-word", instance.name
        )
        Notification.objects.create(title=title, description=description, type=type)
