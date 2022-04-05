from django.urls import include, path
from rest_framework.routers import DefaultRouter

from notification.views import NotificationReadView, NotificationView


urlpatterns = [
    path("", NotificationView.as_view(), name="notificationView"),
    path("read/", NotificationReadView, name="notificationReadView"),
]
