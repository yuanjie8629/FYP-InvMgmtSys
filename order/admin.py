from django.contrib import admin
from core.admin import SoftDeleteAdmin
from order.models import Order
from reversion.admin import VersionAdmin


@admin.register(Order)
class OrderAdmin(VersionAdmin, SoftDeleteAdmin):
    pass
