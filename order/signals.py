from opcode import hasconst
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from order.models import Order, OrderLine
from rest_framework import serializers
from django.utils.translation import gettext as _
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.db.models import Sum, F, Case, When
from shipment.models import Shipment
from reversion.models import Version


@receiver(post_save, sender=Order)
def send_order_confirmation(sender, instance, **kwargs):
    update_fields = kwargs["update_fields"]
    if (
        update_fields is not None
        and "status" in update_fields
        and (instance.status == "shipping")
    ):
        shipment = instance.shipment.shipment
        postcode = shipment.postcode
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

        context = {
            "email": instance.email,
            "contact_name": shipment.contact_name,
            "contact_num": shipment.contact_num,
            "address": shipment.address if hasattr(shipment, "address") else None,
            "postcode": postcode.postcode if hasattr(postcode, "postcode") else None,
            "city": postcode.city if hasattr(postcode, "city") else None,
            "state": postcode.state.name if hasattr(postcode, "state") else None,
            "order_id": instance.id,
            "total_price": instance.total_amt,
            "shipping_fee": shipment.ship_fee
            if hasattr(shipment, "ship_fee")
            else None,
            "discount": "{:.2f}".format(float(total_discount))
            if instance.voucher
            else None,
            "subtotal": subtotal,
            "order_line": order_line,
            "voucher": code if instance.voucher else None,
            "track_num": shipment.track_num,
        }

        # render email text
        email_html_message = render_to_string("order_shipped.html", context)
        email_plaintext_message = render_to_string("order_shipped.txt", context)

        print("sending email")
        msg = EmailMultiAlternatives(
            # title:
            "{title} - Order Shipped".format(title="Sharifah Food"),
            # message:
            email_plaintext_message,
            # from:
            "fyp.shrf@gmail.com",
            # to:
            [instance.email],
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()

    if (
        update_fields is not None
        and "status" in update_fields
        and (instance.status == "cancel")
    ):
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

        context = {
            "email": instance.email,
            "contact_name": shipment.contact_name,
            "contact_num": shipment.contact_num,
            "shipment": True if check_shipment else False,
            "address": shipment.address if hasattr(shipment, "address") else None,
            "postcode": postcode.postcode if hasattr(postcode, "postcode") else None,
            "city": postcode.city if hasattr(postcode, "city") else None,
            "state": postcode.state.name if hasattr(postcode, "state") else None,
            "pickup": shipment.pickup_loc.location if not check_shipment else None,
            "order_id": instance.id,
            "total_price": instance.total_amt,
            "shipping_fee": shipment.ship_fee
            if hasattr(shipment, "ship_fee")
            else None,
            "discount": "{:.2f}".format(float(total_discount))
            if instance.voucher
            else None,
            "subtotal": subtotal,
            "order_line": order_line,
            "voucher": code if instance.voucher else None,
        }

        # render email text
        email_html_message = render_to_string("order_cancel.html", context)
        email_plaintext_message = render_to_string("order_cancel.txt", context)

        print("sending email")
        msg = EmailMultiAlternatives(
            # title:
            "{title} - Order Cancellation".format(title="Sharifah Food"),
            # message:
            email_plaintext_message,
            # from:
            "fyp.shrf@gmail.com",
            # to:
            [instance.email],
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()
