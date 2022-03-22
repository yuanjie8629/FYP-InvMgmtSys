from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string
from core.models import Users
from customer.models import Cust, CustPosReg
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


@receiver(post_save, sender=CustPosReg)
def add_cust_pos(sender, instance, **kwargs):
    if instance.accept == True:
        user = Cust.objects.create(
            name=instance.name,
            birthdate=instance.birthdate,
            gender=instance.gender,
            email=instance.email,
            username=instance.email,
            cust_type=instance.position,
            pos_reg=instance,
        )

        password = get_random_string(30, settings.SECRET_KEY)
        user.set_password(password)
        print(password)
        user.save()

        print("sending email")
        # send an e-mail to the user
        context = {
            "name": user.name,
            "email": user.email,
            "password": password,
            "position": "agent" if instance.position.type == "agent" else "dropshipper",
        }

        # render email text
        email_html_message = render_to_string("position_confirm_email.html", context)
        email_plaintext_message = render_to_string(
            "position_confirm_email.txt", context
        )

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
            [user.email],
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()
        return user
