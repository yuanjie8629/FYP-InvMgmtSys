from django.urls import include, path
from rest_framework.routers import DefaultRouter
from order.views import (
    BulkInvoicesView,
    InvoiceView,
    OrderCancelView,
    OrderPickupUpdView,
    OrderTrackNumUpdView,
    OrderViewSet,
)

router = DefaultRouter()
router.register(r"", OrderViewSet)

urlpatterns = [
    path(r"track_num/update/", OrderTrackNumUpdView, name="orderTrackNumUpdView"),
    path(r"pickup/update/", OrderPickupUpdView, name="orderPickupUpdView"),
    path(r"cancel/", OrderCancelView, name="orderCancelView"),
    path(r"invoices/bulk/", BulkInvoicesView, name="bulkInvoicesView"),
    path(r"invoice/<str:id>/", InvoiceView.as_view(), name="invoiceView"),
]

urlpatterns += router.urls
