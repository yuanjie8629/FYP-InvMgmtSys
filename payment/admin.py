from django.contrib import admin
from payment.models import Payment
from reversion.admin import VersionAdmin


@admin.register(Payment)
class PaymentAdmin(VersionAdmin):
    pass
