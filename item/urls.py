from django.urls import include, path
from rest_framework.routers import DefaultRouter

from item.views import (
    ItemListView,
    PackagePrevView,
    PackageViewSet,
    ProdPrevAllView,
    ProductPrevView,
    ProductViewSet,
    ItemBulkDeleteView,
    PackBulkUpdView,
    ProdBulkUpdView,
)

router = DefaultRouter()
# router.register("", ItemViewSet)
router.register(r"product", ProductViewSet)
router.register(r"package", PackageViewSet)

urlpatterns = [
    path("", ItemListView.as_view(), name="itemList"),
    path(r"product/prev/", ProductPrevView.as_view(), name="productPrev"),
    path(r"product/bulk/update/", ProdBulkUpdView, name="productBulkUpd"),
    path(r"bulk/delete/", ItemBulkDeleteView, name="productBulkDel"),
    path(r"package/prev/", PackagePrevView.as_view(), name="packagePrev"),
    path(r"product/prev/all/", ProdPrevAllView.as_view(), name="productPrevAll"),
    path(r"package/bulk/update/", PackBulkUpdView, name="packageBulkUpd"),
]


urlpatterns += router.urls
