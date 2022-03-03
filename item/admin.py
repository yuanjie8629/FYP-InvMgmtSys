from importlib.resources import Package
from django.contrib import admin

from item.models import Item, PackageItem, Product, Package

# Register your models here.
admin.site.register(Item)
admin.site.register(Product)
admin.site.register(Package)
admin.site.register(PackageItem)
