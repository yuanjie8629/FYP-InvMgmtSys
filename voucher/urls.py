from django.urls import include, path
from rest_framework.routers import DefaultRouter
from voucher.views import VoucherViewSet, VoucherBulkDeleteView, VoucherBulkUpdView

router = DefaultRouter()

router.register(r"", VoucherViewSet)

urlpatterns = [
    path(r"bulk/update/", VoucherBulkUpdView, name="voucherBulkUpd"),
    path(r"bulk/delete/", VoucherBulkDeleteView, name="voucherBulkDel"),
]


urlpatterns += router.urls
