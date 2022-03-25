from django.urls import include, path
from rest_framework.routers import DefaultRouter

from shipment.views import (
    PickupLocBulkDeleteView,
    PickupLocViewSet,
    ShippingFeeBulkDeleteView,
    ShippingFeeStateListView,
    ShippingFeeViewSet,
)

router = DefaultRouter()
router.register(r"shipping_fee", ShippingFeeViewSet)
router.register(r"pickup_loc", PickupLocViewSet)

urlpatterns = [
    path(
        "shipping_fee/state/",
        ShippingFeeStateListView.as_view(),
        name="shippingFeeStateListView",
    ),
    path(
        r"shipping_fee/bulk/delete/", ShippingFeeBulkDeleteView, name="shptFeeBulkDel"
    ),
    path(r"pickup_loc/bulk/delete/", PickupLocBulkDeleteView, name="pickupBulkDel"),
]

urlpatterns += router.urls
