from django.contrib import admin
from core.admin import SoftDeleteAdmin

from voucher.models import Voucher
from reversion.admin import VersionAdmin


@admin.register(Voucher)
class VoucherAdmin(SoftDeleteAdmin, VersionAdmin):
    pass
