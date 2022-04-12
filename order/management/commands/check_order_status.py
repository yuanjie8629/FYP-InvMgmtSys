import datetime
from order.models import Order
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = "Daily Checking to convert shipping order to completed order after 14 days"

    def handle(self, *args, **options):
        completing_orders = Order.objects.filter(
            last_update=datetime.date.today() - datetime.timedelta(days=14)
        )
        for order in completing_orders:
            order.status = "completed"
            order.save()
