from django.db import models
from administrator.choices import ADMIN_ROLE
from core.models import Users


class Admin(Users):
    role = models.CharField(max_length=20, blank=True, null=True, choices=ADMIN_ROLE)
    phone_num = models.CharField(max_length=15)

    class Meta:
        db_table = "admin"
