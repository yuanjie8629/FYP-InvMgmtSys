from django.urls import include, path

from .views import AdminDetails, AdminList

urlpatterns = [
    path("<int:id>/", AdminDetails.as_view()),
    path("", AdminList.as_view()),
]
