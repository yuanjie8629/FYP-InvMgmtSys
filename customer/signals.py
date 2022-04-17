import re
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from customer.models import Cust, CustPosReg
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


@receiver(post_save, sender=CustPosReg)
def add_cust_pos(sender, instance, **kwargs):
    if instance.accept is not None:
        if instance.accept == True:
            user = Cust.objects.filter(email=instance.email).first()
            if user is not None:
                user.cust_type = instance.position
                user.name = instance.name
                user.birthdate = instance.birthdate
                user.gender = instance.gender
                user.pos_reg = instance
                user.save()

                context = {
                    "name": instance.name,
                    "email": instance.email,
                    "position": "agent"
                    if instance.position.type == "agent"
                    else "dropshipper",
                }

                # render email text
                email_html_message = render_to_string(
                    "position_confirm_existing_acc.html", context
                )
                email_plaintext_message = render_to_string(
                    "position_confirm_existing_acc.txt", context
                )

            else:
                user = Cust.objects.create(
                    name=instance.name,
                    birthdate=instance.birthdate,
                    gender=instance.gender,
                    email=instance.email,
                    username=instance.email,
                    cust_type=instance.position,
                    pos_reg=instance,
                    # date_joined= instance.created_at
                )

                password = Cust.objects.make_random_password(
                    length=30,
                    allowed_chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789[()[\]{}|\\`~!@#$%^&*_\-+=;:'\",<>./?]",
                )

                user.set_password(password)
                user.save()

                context = {
                    "name": instance.name,
                    "email": instance.email,
                    "password": password,
                    "position": "agent"
                    if instance.position.type == "agent"
                    else "dropshipper",
                }

                # render email text
                email_html_message = render_to_string(
                    "position_confirm_new_acc.html", context
                )
                email_plaintext_message = render_to_string(
                    "position_confirm_new_acc.txt", context
                )
        else:
            context = {
                "name": instance.name,
                "email": instance.email,
                "position": "agent"
                if instance.position.type == "agent"
                else "dropshipper",
            }

            # render email text
            email_html_message = render_to_string("position_reject_email.html", context)
            email_plaintext_message = render_to_string(
                "position_reject_email.txt", context
            )

        print("sending email")
        msg = EmailMultiAlternatives(
            # title:
            "{title} - {position} Application".format(
                title="Sharifah Food",
                position="Agent"
                if instance.position.type == "agent"
                else "Dropshipper",
            ),
            # message:
            email_plaintext_message,
            # from:
            "fyp.shrf@gmail.com",
            # to:
            [instance.email],
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()
        return instance


def cust_status_email(instance):
    if instance.is_active:
        context = {
            "name": instance.name,
            "email": instance.email,
            "position": "agent" if instance.cust_type == "agent" else "dropshipper",
        }

        # render email text
        email_html_message = render_to_string("position_activate_email.html", context)
        email_plaintext_message = render_to_string(
            "position_activate_email.txt", context
        )

    elif not instance.is_active:
        context = {
            "name": instance.name,
            "email": instance.email,
            "position": "agent" if instance.cust_type == "agent" else "dropshipper",
        }

        # render email text
        email_html_message = render_to_string("position_suspend_email.html", context)
        email_plaintext_message = render_to_string(
            "position_suspend_email.txt", context
        )

    print("sending email")
    msg = EmailMultiAlternatives(
        # title:
        "{title} - Account {status}".format(
            title="Sharifah Food",
            status="Reactivation" if instance.is_active else "Suspension",
        ),
        # message:
        email_plaintext_message,
        # from:
        "fyp.shrf@gmail.com",
        # to:
        [instance.email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
    return instance
