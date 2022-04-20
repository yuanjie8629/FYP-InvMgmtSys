from django.contrib import admin
from core.admin import SoftDeleteAdmin
from item.models import ImageItemLine, Item, PackageItem, Product, Package
from django.contrib import admin
from polymorphic.admin import (
    PolymorphicParentModelAdmin,
    PolymorphicChildModelAdmin,
)
from reversion.admin import VersionAdmin
from reversion import revisions


class ItemChildAdmin(SoftDeleteAdmin, VersionAdmin, PolymorphicChildModelAdmin):
    base_model = Item


class ProductAdmin(ItemChildAdmin):
    pass


class PackageAdmin(ItemChildAdmin):
    pass


class ItemParentAdmin(SoftDeleteAdmin, VersionAdmin, PolymorphicParentModelAdmin):
    base_model = Item
    child_models = ((Product), Package)


revisions.register(Product, follow=["item_ptr"])
revisions.register(Package, follow=["item_ptr"])
admin.site.register(PackageItem)
admin.site.register(ImageItemLine)
admin.site.register(Product, ProductAdmin)
admin.site.register(Package, PackageAdmin)
admin.site.register(Item, ItemParentAdmin)
