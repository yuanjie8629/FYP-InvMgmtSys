import datetime
from voucher.models import Voucher
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = "Daily Checking for voucher to launch / expired"

    def handle(self, *args, **options):
        launching_voucher = Voucher.objects.filter(
            avail_start_dt__lte=datetime.date.today(), status="scheduled"
        )
        print("launching voucher")
        print(launching_voucher)
        if launching_voucher:
            for voucher in launching_voucher:
                voucher.status = "active"
                voucher.save()

        print("----------------------------")

        expire_voucher = Voucher.objects.filter(
            avail_end_dt__lt=datetime.date.today(), status="active"
        )
        print("expired voucher")
        print(expire_voucher)
        if expire_voucher:
            for voucher in expire_voucher:
                voucher.status = "expired"
                voucher.save()
            
        return
