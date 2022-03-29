from django.contrib import admin
from administrator.models import Admin
from reversion.admin import VersionAdmin


@admin.register(Admin)
class AdministratorAdmin(VersionAdmin):
    pass
