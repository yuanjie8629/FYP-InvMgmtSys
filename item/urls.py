from django.urls import include, path
from rest_framework.routers import DefaultRouter

from item.views import (
    PackagePrevView,
    PackageViewSet,
    ProductPrevView,
    ProductViewSet,
    prodBulkDeleteView,
    prodBulkUpdView,
)

router = DefaultRouter()
router.register(r"product", ProductViewSet)
router.register(r"package", PackageViewSet)

urlpatterns = [
    path(r"product/prev/", ProductPrevView.as_view(), name="productPrev"),
    path(r"product/bulk/update/", prodBulkUpdView, name="productBulkUpd"),
    path(r"product/bulk/delete/", prodBulkDeleteView, name="productBulkDel"),
    path(r"package/prev/", PackagePrevView.as_view(), name="packagePrev"),
]


urlpatterns += router.urls
