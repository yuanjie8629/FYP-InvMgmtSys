from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    CustPosRegDetailsView,
    CustPosRegView,
    CustRegUpdView,
    CustStatusUpdView,
    CustView,
)

router = DefaultRouter()
router.register("", CustView)


urlpatterns = [
    path(r"status/update/", CustStatusUpdView, name="custBulkUpd"),
    path(r"registration/", CustPosRegView.as_view(), name="custRegView"),
    path(
        r"registration/<int:pk>/",
        CustPosRegDetailsView.as_view(),
        name="custRegDetailsView",
    ),
    path(r"registration/update/", CustRegUpdView, name="custRegBulkUpd"),
]

urlpatterns += router.urls
