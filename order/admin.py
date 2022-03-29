from django.contrib import admin
from order.models import Order
from reversion.admin import VersionAdmin


@admin.register(Order)
class OrderAdmin(VersionAdmin):
    pass
