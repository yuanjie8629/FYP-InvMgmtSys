from django.urls import include, path

from .views import AdminDetails, AdminList

urlpatterns = [
    path("<int:admin_id>/", AdminDetails.as_view()),
    path("", AdminList.as_view()),
]
