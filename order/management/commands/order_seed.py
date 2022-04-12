import datetime
import random
from django.core.management import BaseCommand
from order.models import Order, OrderLine
from item.models import Item, PackageItem, Product
from customer.models import Cust
from payment.choices import PAYMENT_METHOD
from postcode.models import Postcode
from shipment.models import Pickup, PickupLoc, Shipment, ShippingFee
from payment.models import Payment
from voucher.models import Voucher
from faker import Faker
from voucher.serializers import VoucherSerializer
from django.db.models import Sum, F


class Command(BaseCommand):
    help = "Data seeding for Shipping Order"

    def calculate_discount(self, total_amt, voucher, user):
        voucher_instance = voucher
        voucher = VoucherSerializer(voucher).data
        print(voucher)

        if not user.cust_type.type in voucher.get("cust_type"):
            print("invalid cust_type")
            return 0

        if voucher.get("total_amt", None) == 0:
            print("fully redeemed")
            return 0

        orders = Order.objects.filter(cust=user, voucher=voucher_instance)
        print(orders.count())
        print(voucher.get("usage_limit"))

        if (
            orders.count() > voucher.get("usage_limit")
            and voucher.get("usage_limit") != -1
        ):
            print("exceed redemption limit.")
            return 0

        min_spend = voucher.get("min_spend", None)
        if min_spend and float(total_amt) < float(min_spend):
            print("below min spend")
            return 0

        type = voucher.get("type", None)
        discount = voucher.get("discount", None)
        max_discount = voucher.get("max_discount", None)

        if type == "percentage":
            total_discount = float(total_amt) * float(discount)

        if type == "amount":
            total_discount = discount

        if max_discount and total_discount > max_discount:
            total_discount = max_discount

        return "{:.2f}".format(float(total_discount))

    def handle(self, *args, **options):
        faker = Faker()
        cust_list = Cust.objects.all()

        for x in range(60):
            cust = random.choice(cust_list)
            shipment_type = random.choice(["shipping", "pickup"])
            contact_num = faker.numerify(text="01########")
            postcode = random.choice(list(Postcode.objects.all()))
            ship_fee = 0
            payment_method_list = [method[0] for method in PAYMENT_METHOD]
            date = faker.date_between_dates(
                date_start=datetime.datetime(2021, 1, 1),
                date_end=datetime.datetime.today(),
            )
            print(date)
            order_date = faker.date_time_between(
                start_date=date - datetime.timedelta(days=7), end_date=date
            )
            print(order_date)
            voucher = (
                Voucher.objects.all()
                .filter(
                    status="active",
                    avail_start_dt__lte=order_date,
                    avail_end_dt__gte=order_date,
                    auto_apply=True,
                    cust_type=cust.cust_type,
                )
                .order_by("created_at")
                .prefetch_related("cust_type")
                .first()
            )
            print(voucher)
            if shipment_type == "shipping":
                ship_fee = random.choice(
                    list(ShippingFee.objects.filter(location=postcode.state))
                ).ship_fee
                shipment = Shipment.objects.create(
                    created_at=date,
                    last_update=date,
                    track_num=faker.numerify(text="ERC#########MY"),
                    address=faker.address(),
                    contact_name=cust.name,
                    contact_num=contact_num,
                    postcode=postcode,
                    ship_fee=ship_fee,
                )
            else:

                shipment = Pickup.objects.create(
                    created_at=date,
                    last_update=date,
                    contact_name=cust.name,
                    contact_num=contact_num,
                    pickup_dt=date,
                    pickup_loc=random.choice(list(PickupLoc.objects.all())),
                )

            order = Order.objects.create(
                created_at=order_date,
                last_update=order_date,
                status="unpaid",
                email=cust.email,
                cust=cust,
                shipment=shipment,
                total_amt=0,
                voucher=voucher,
            )

            item = Item.objects.all()
            total_amount = 0
            for x in range(random.randint(1, 6)):
                selected_item = random.choice(list(item))
                quantity = random.randint(1, 10)
                while order.order_line.all().filter(item=selected_item).exists():
                    selected_item = random.choice(list(item))
                if selected_item.special_price:
                    total_amount += float(selected_item.special_price * quantity)
                else:
                    total_amount += float(selected_item.price * quantity)

                if isinstance(selected_item, Product):
                    cost_per_unit = selected_item.cost_per_unit
                else:
                    cost_per_unit = (
                        PackageItem.objects.filter(pack=selected_item)
                        .aggregate(
                            cost_per_unit=Sum(F("quantity") * F("prod__cost_per_unit"))
                        )
                        .get("cost_per_unit")
                    )

                OrderLine.objects.create(
                    order=order,
                    item=selected_item,
                    price=selected_item.price,
                    special_price=selected_item.special_price,
                    cost_per_unit=cost_per_unit,
                    weight=selected_item.weight,
                    quantity=random.randint(1, 10),
                )
                print(selected_item)
                print(quantity)

            if voucher:
                discount = float(self.calculate_discount(total_amount, voucher, cust))
            else:
                discount = 0

            total_amount += float(ship_fee) - float(discount)
            print(total_amount)
            Payment.objects.create(
                created_at=order_date,
                last_update=order_date,
                method=random.choice(payment_method_list),
                amount=total_amount,
                paid=True,
                reference_num=faker.bothify(text="pi_#??#??????????#?#??????#"),
                order=order,
            )
            order.total_amt = total_amount
            order.status = "completed"
            order.created_at = order_date
            order.save(update_fields=["total_amt", "status", "created_at"])
