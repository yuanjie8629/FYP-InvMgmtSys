from django.contrib import admin
from customer.models import Cust, CustPosReg
from reversion.admin import VersionAdmin


@admin.register(Cust)
class CustAdmin(VersionAdmin):
    pass


@admin.register(CustPosReg)
class CustPosRegAdmin(VersionAdmin):
    pass
