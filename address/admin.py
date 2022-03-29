from django.contrib import admin
from address.models import Address
from reversion.admin import VersionAdmin


@admin.register(Address)
class AddressAdmin(VersionAdmin):
    pass
