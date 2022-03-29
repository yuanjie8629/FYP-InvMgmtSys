from django.contrib import admin
from shipment.models import OrderShipment, Shipment, Pickup, ShippingFee, PickupLoc
from django.contrib import admin
from polymorphic.admin import (
    PolymorphicParentModelAdmin,
    PolymorphicChildModelAdmin,
)
from reversion.admin import VersionAdmin
from reversion import revisions


class OrderShipmentChildAdmin(PolymorphicChildModelAdmin, VersionAdmin):
    base_model = OrderShipment


class ShipmentAdmin(OrderShipmentChildAdmin, VersionAdmin):
    base_model = OrderShipment


class PickupAdmin(OrderShipmentChildAdmin, VersionAdmin):
    base_model = OrderShipment


class ItemParentAdmin(VersionAdmin, PolymorphicParentModelAdmin):
    base_model = OrderShipment
    child_models = (Shipment, Pickup)


@admin.register(ShippingFee)
class ShippingFeeAdmin(VersionAdmin):
    pass


@admin.register(PickupLoc)
class PickupLocAdmin(VersionAdmin):
    pass


revisions.register(Shipment, follow=["ordershipment_ptr"])
revisions.register(Pickup, follow=["ordershipment_ptr"])
admin.site.register(OrderShipment, ItemParentAdmin)
admin.site.register(Shipment, ShipmentAdmin)
admin.site.register(Pickup, PickupAdmin)
