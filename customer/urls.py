from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CustPosRegView, CustStatusUpdView, CustView

router = DefaultRouter()
router.register("", CustView)


urlpatterns = [
    path(r"status/update/", CustStatusUpdView, name="customerBulkUpd"),
    path(r"registration/", CustPosRegView.as_view(), name="customerBulkUpd"),
]

urlpatterns += router.urls
