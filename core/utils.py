from datetime import date
from django.conf import settings
import jwt
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions,status
from rest_framework.response import Response
from customer.models import Cust
from order.models import Order
from shipment.models import ShippingFee
from shipment.serializers import ShippingFeeSerializer
from voucher.models import Voucher
from voucher.serializers import VoucherSerializer



def enforce_csrf(request):
    check = CSRFCheck(request)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied("CSRF Failed: %s" % reason)


def show_debug_toolbar_in_staging(*args, **kwargs):
    return True


def dict_to_querydict(dictionary):
    from django.http import QueryDict
    from django.utils.datastructures import MultiValueDict

    qdict = QueryDict("", mutable=True)

    for key, value in dictionary.items():
        d = {key: value}
        qdict.update(MultiValueDict(d) if isinstance(value, list) else d)

    return qdict


def update_request_data(request, data):
    if hasattr(request.data, "_mutable"):
        request.data._mutable = True
    request.data.clear()
    request.data.update(data)
    if hasattr(request.data, "_mutable"):
        request.data._mutable = False
    return request


def split_date(date):
    return date.split("-")


def get_request_cust(request):
    refresh = jwt.decode(
        request.COOKIES.get("refresh_token"),
        settings.SIMPLE_JWT["SIGNING_KEY"],
        algorithms=[settings.SIMPLE_JWT["ALGORITHM"]],
    )
    return Cust.objects.get(pk=refresh.get("user_id"))


def calculate_ship_fee(total_weight, state):
    shipping_fee = ShippingFee.objects.filter(
        location__name=state,
        weight_start__lte=total_weight,
        weight_end__gte=total_weight,
    ).first()
    
    if not shipping_fee:
        weight_most_end = (
            ShippingFee.objects.filter(location__name=state)
            .order_by("-weight_end")
            .first()
        )
        if hasattr(weight_most_end, 'sub_fee'):
            sub_fee = weight_most_end.sub_fee
        if hasattr(weight_most_end, 'sub_weight'):
            sub_weight = weight_most_end.sub_weight
        ship_fee = weight_most_end.ship_fee
        weight_end = weight_most_end.weight_end
        remain_weight = total_weight - weight_end
        if sub_fee and sub_weight:
            shipping_fee = ship_fee + (remain_weight / sub_weight * sub_fee)
            return "{:.2f}".format(float(shipping_fee))
        return "0"
    serializer = ShippingFeeSerializer(shipping_fee)
    return "{:.2f}".format(float(serializer.data.get("ship_fee")))



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
            avail_start_dt__lte=date.today(),
            avail_end_dt__gte=date.today(),
        )
        .prefetch_related("cust_type")
        .first()
    )
    return calculate_discount(total_amt, voucher_instance, user)