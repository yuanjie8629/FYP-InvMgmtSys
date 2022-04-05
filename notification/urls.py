from django.urls import include, path
from rest_framework.routers import DefaultRouter

from notification.views import NotificationView


urlpatterns = [
    path("", NotificationView.as_view(), name="notificationView"),
]
