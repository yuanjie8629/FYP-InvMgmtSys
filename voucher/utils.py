import datetime
from order.models import Order
from voucher.models import Voucher
from voucher.serializers import VoucherSerializer
from rest_framework import status
from rest_framework.response import Response

def calculate_discount(total_amt, voucher, user):
    voucher_instance = voucher
    voucher = VoucherSerializer(voucher).data
    print(voucher)

    if not hasattr(user, "cust"):
        return Response(
            status=status.HTTP_404_NOT_FOUND, data={"discount": "require_login"}
        )

    if not user.cust.cust_type.type in voucher.get("cust_type"):
        print("invalid cust_type")
        return "invalid"

    if voucher.get("total_amt", None) == 0:
        print("fully redeemed")
        return "no_stock"

    orders = Order.objects.filter(cust=user, voucher=voucher_instance)
    print(orders.count())
    print(voucher.get("usage_limit"))

    if orders.count() > voucher.get("usage_limit") and voucher.get("usage_limit") != -1:
        print("exceed redemption limit.")
        return "exceed_limit"

    min_spend = voucher.get("min_spend", None)
    if min_spend and float(total_amt) < float(min_spend):
        print("below min spend")
        return {"min_spend": min_spend}

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


def calculate_disocunt_by_code(total_amt, code, user):
    voucher_instance = (
        Voucher.objects.all()
        .filter(
            code=code,
            status="active",
            avail_start_dt__lte=datetime.today(),
            avail_end_dt__gte=datetime.date.today(),
        )
        .prefetch_related("cust_type")
        .first()
    )
    return calculate_discount(total_amt, voucher_instance, user)