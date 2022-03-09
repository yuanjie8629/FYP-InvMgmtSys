from django.contrib import admin
from core.admin import SoftDeleteAdmin
from item.models import Item, PackageItem, Product, Package
from simple_history.admin import SimpleHistoryAdmin


# Register your models here.
admin.site.register(Item, SoftDeleteAdmin)
admin.site.register(Product, SimpleHistoryAdmin)
admin.site.register(Package, SimpleHistoryAdmin)
admin.site.register(PackageItem, SimpleHistoryAdmin)
