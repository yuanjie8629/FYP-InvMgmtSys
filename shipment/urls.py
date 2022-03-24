from django.urls import include, path
from rest_framework.routers import DefaultRouter

from shipment.views import (
    ShippingFeeBulkDeleteView,
    ShippingFeeStateListView,
    ShippingFeeViewSet,
)

router = DefaultRouter()
router.register(r"shipping_fee", ShippingFeeViewSet)

urlpatterns = [
    path(
        "shipping_fee/state/",
        ShippingFeeStateListView.as_view(),
        name="shippingFeeStateListView",
    ),
    path(
        r"shipping_fee/bulk/delete/", ShippingFeeBulkDeleteView, name="shptFeeBulkDel"
    )
]

urlpatterns += router.urls
