import datetime
from item.models import Package
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = "Daily Checking for package to launch / expired"

    def handle(self, *args, **options):
        launching_package = Package.objects.filter(
            avail_start_dt__lte=datetime.date.today(), status="scheduled"
        )
        print("launching package")
        print(launching_package)
        if launching_package:
            for pack in launching_package:
                pack.status = "active"
                pack.save()

        print("----------------------------")

        expire_package = Package.objects.filter(
            avail_end_dt__lt=datetime.date.today(), status="active"
        )
        print("expired package")
        print(expire_package)
        if expire_package:
            for pack in expire_package:
                pack.status = "expired"
                pack.save()
        return