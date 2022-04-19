from django.contrib import admin
from core.admin import SoftDeleteAdmin
from payment.models import Payment
from reversion.admin import VersionAdmin


@admin.register(Payment)
class PaymentAdmin(SoftDeleteAdmin, VersionAdmin):
    pass
