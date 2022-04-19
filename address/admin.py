from django.contrib import admin
from address.models import Address
from reversion.admin import VersionAdmin

from core.admin import SoftDeleteAdmin


@admin.register(Address)
class AddressAdmin(VersionAdmin, SoftDeleteAdmin):
    pass
