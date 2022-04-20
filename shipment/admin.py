from django.contrib import admin
from core.admin import SoftDeleteAdmin
from shipment.models import OrderShipment, Shipment, Pickup, ShippingFee, PickupLoc
from django.contrib import admin
from polymorphic.admin import (
    PolymorphicParentModelAdmin,
    PolymorphicChildModelAdmin,
)
from reversion.admin import VersionAdmin
from reversion import revisions


class OrderShipmentChildAdmin(
    SoftDeleteAdmin, VersionAdmin, PolymorphicChildModelAdmin
):
    base_model = OrderShipment


class ShipmentAdmin(OrderShipmentChildAdmin):
    pass


class PickupAdmin(OrderShipmentChildAdmin):
    pass


class OrderShipmentParentAdmin(
    SoftDeleteAdmin, VersionAdmin, PolymorphicParentModelAdmin
):
    base_model = OrderShipment
    child_models = (Shipment, Pickup)


@admin.register(ShippingFee)
class ShippingFeeAdmin(SoftDeleteAdmin, VersionAdmin):
    pass

@admin.register(PickupLoc)
class PickupLocAdmin(SoftDeleteAdmin, VersionAdmin):
    pass

revisions.register(Shipment, follow=["ordershipment_ptr"])
revisions.register(Pickup, follow=["ordershipment_ptr"])
admin.site.register(OrderShipment, OrderShipmentParentAdmin)
admin.site.register(Shipment, ShipmentAdmin)
admin.site.register(Pickup, PickupAdmin)
