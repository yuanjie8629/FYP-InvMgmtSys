import datetime
from django.dispatch import receiver
from django.db.models.signals import post_save
from voucher.models import Voucher


@receiver(post_save, sender=Voucher)
def check_voucher_status(sender, instance, **kwargs):
    if (
        instance.avail_start_dt <= datetime.date.today()
        and instance.avail_end_dt >= datetime.date.today()
        and instance.status != "active"
    ):
        instance.status = "active"
        instance.save()

    if (
        instance.avail_start_dt <= datetime.date.today()
        and instance.status == "scheduled"
    ):
        instance.status = "active"
        instance.save()

    if instance.avail_end_dt < datetime.date.today() and instance.status == "active":
        instance.status = "expired"
        instance.save()

    return
