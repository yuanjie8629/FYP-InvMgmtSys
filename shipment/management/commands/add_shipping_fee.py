import csv
from django.core.management import BaseCommand
from django.utils import timezone
from shipment.models import ShippingFee
from postcode.models import State


class Command(BaseCommand):
    help = "Loads shipping fee from CSV file."

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
        start_time = timezone.now()
        file_path = "shipment/shipping_fee.csv"
        with open(file_path, "r") as csv_file:
            data = csv.reader(csv_file, delimiter=",")
            list = []
            header = next(data)
            print(header)
            for row in data:
                shipping_fee = ShippingFee(
                    location=State.objects.get(pk=row[0]),
                    weight_start=row[1],
                    weight_end=row[2],
                    ship_fee=row[3],
                    sub_fee=row[4] if row[4] else None,
                    sub_weight=row[5] if row[5] else None,
                )
                list.append(shipping_fee)
                if len(list) > 5000:
                    ShippingFee.objects.bulk_create(list)
                    list = []
            if list:
                ShippingFee.objects.bulk_create(list)
        end_time = timezone.now()
        self.stdout.write(
            self.style.SUCCESS(
                f"Loading CSV took: {(end_time-start_time).total_seconds()} seconds."
            )
        )
