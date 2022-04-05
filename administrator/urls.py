from django.urls import include, path

from .views import AdminDetails, AdminList, ChangePassView

urlpatterns = [
    path("<int:id>/", AdminDetails.as_view()),
    path("", AdminList.as_view()),
    path("<int:pk>/change_pass/", ChangePassView.as_view(), name="change-pass"),
]
