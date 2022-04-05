import datetime
from voucher.models import Voucher
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = "Daily Checking for voucher to launch / expired"

    def handle(self, *args, **options):
        launching_voucher = Voucher.objects.filter(
            avail_start_dt__gte=datetime.date.today()
        )
        print("launching voucher")
        print(launching_voucher)
        if launching_voucher:
            for pack in launching_voucher:
                pack.status = "active"
                pack.save()

        print("----------------------------")

        expire_voucher = Voucher.objects.filter(avail_end_dt__lt=datetime.date.today())
        print("expired voucher")
        print(expire_voucher)
        if expire_voucher:
            for pack in expire_voucher:
                pack.status = "expired"
                pack.save()
