from django.db import models
from core.models import AuthModel

GENDER_CHOICES = (
    ("M", "Male"),
    ("F", "Female"),
)


class Admin(AuthModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(unique=True, max_length=45)
    password = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    phone_num = models.CharField(max_length=15)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=1, blank=True, null=True, choices=GENDER_CHOICES
    )
    first_name = None
    last_name = None

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    class Meta:
        db_table = "admin"
