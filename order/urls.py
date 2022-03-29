from django.urls import include, path
from rest_framework.routers import DefaultRouter
from order.views import (
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
]

urlpatterns += router.urls
