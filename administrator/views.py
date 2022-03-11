from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from rest_framework import permissions
from django_rest_passwordreset.signals import reset_password_token_created
from administrator.models import Admin
from rest_framework import generics
from .serializers import AdminSerializer


class AdminList(generics.ListCreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer


class AdminDetails(generics.RetrieveDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = "admin_id"


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        "current_user": reset_password_token.user.name,
        "username": reset_password_token.user.username,
        "email": reset_password_token.user.email,
        "reset_password_url": "{}?token={}&email={}".format(
            instance.request.build_absolute_uri("/pass_reset"),
            reset_password_token.key,
            reset_password_token.user.email,
        ),
    }

    # render email text
    email_html_message = render_to_string("reset_password_email.html", context)
    email_plaintext_message = render_to_string("reset_password_email.txt", context)

    msg = EmailMultiAlternatives(
        # title:
        "{title} - Password Reset".format(title="Sharifah Food"),
        # message:
        email_plaintext_message,
        # from:
        "yuanjie8629@gmail.com",
        # to:
        [reset_password_token.user.email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
