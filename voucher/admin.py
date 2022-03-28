from django.contrib import admin

from voucher.models import Voucher
from reversion.admin import VersionAdmin


@admin.register(Voucher)
class VoucherAdmin(VersionAdmin):
    pass
