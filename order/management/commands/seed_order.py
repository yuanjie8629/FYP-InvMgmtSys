from django.core.management import BaseCommand
from django_seed import Seed
from order.models import OrderLine

class Command(BaseCommand):
    help = "Data seeding for orders"

    # def handle(self, *args, **kwargs):
    #     insert_count = ShippingFee.objects.from_csv(
    #         "shipment/shipping_fee.csv",
    #         static_mapping={
    #             "created_at": datetime.now(),
    #             "last_update": datetime.now(),
    #             "is_deleted": False,
    #         },
    #     )
    #     print("{} records inserted".format(insert_count))

    def handle(self, *args, **options):
        seeder= Seed.seeder()
        seeder.add_entity(OrderLine,5)
        print(seeder.execute())
        
