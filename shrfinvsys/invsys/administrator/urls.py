from django.urls import include, path

from .views import AdminDetails, AdminList

urlpatterns = [
    path("<str:username>/", AdminDetails.as_view()),
    path("", AdminList.as_view()),
]
