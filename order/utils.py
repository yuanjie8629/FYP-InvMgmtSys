from datetime import datetime
from django.template.loader import get_template
from django.db.models import Sum, F, Case, When
from core.utils import render_to_pdf
from order.models import OrderLine
from payment.models import Payment
from shipment.models import Shipment
from reversion.models import Version


def generate_invoice(instance):
    check_shipment = Shipment.objects.filter(order=instance).exists()
    if check_shipment:
        shipment = instance.shipment.shipment
    else:
        shipment = instance.shipment.pickup

    postcode = shipment.postcode if check_shipment else None

    print(shipment)

    order_line = OrderLine.objects.filter(order=instance)
    print(order_line)

    result = instance.order_line.aggregate(
        subtotal_price=Sum(
            Case(
                When(
                    item__special_price__isnull=True,
                    then=(F("quantity") * F("price")),
                ),
                When(
                    item__special_price__isnull=False,
                    then=(F("quantity") * F("special_price")),
                ),
            )
        )
    )

    subtotal = result.get("subtotal_price")

    total_discount = 0

    code = None

    if instance.voucher:
        voucher_version = (
            Version.objects.get_for_object(instance.voucher)
            .filter(revision__date_created__lte=instance.created_at)
            .order_by("-revision__date_created")
            .first()
        )

        code = instance.voucher.code

        if voucher_version:
            code = voucher_version.field_dict["code"]
            if voucher_version.field_dict["type"] == "percentage":
                total_discount = subtotal * voucher_version.field_dict["discount"]
            else:
                total_discount = voucher_version.field_dict["discount"]

        else:
            if instance.voucher.type == "percentage":
                total_discount = subtotal * instance.voucher.discount
            else:
                total_discount = instance.voucher.discount

    payment = Payment.objects.filter(order=instance, paid=True).first()

    context = {
        "contact_name": shipment.contact_name,
        "contact_num": shipment.contact_num,
        "address": shipment.address if hasattr(shipment, "address") else None,
        "postcode": postcode.postcode if hasattr(postcode, "postcode") else None,
        "city": postcode.city if hasattr(postcode, "city") else None,
        "state": postcode.state.name if hasattr(postcode, "state") else None,
        "pickup": shipment.pickup_loc if hasattr(shipment, "pickup_loc") else None,
        "order_id": instance.id,
        "order_date": instance.created_at,
        "total_price": instance.total_amt,
        "shipping_fee": shipment.ship_fee if hasattr(shipment, "ship_fee") else None,
        "discount": "{:.2f}".format(float(total_discount))
        if instance.voucher
        else None,
        "subtotal": subtotal,
        "order_line": order_line,
        "shipment_type": "Shipping" if check_shipment else "Pickup",
        "invoice_date": datetime.now().strftime("%d-%m-%Y"),
        "voucher": code,
        "payment_method": payment.get_method_display() if payment else None,
    }

    template_path = "order_invoice.html"
    return render_to_pdf(template_path, context)
