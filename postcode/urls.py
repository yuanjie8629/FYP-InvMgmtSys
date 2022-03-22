from django.urls import include, path
from rest_framework.routers import DefaultRouter


from postcode.views import PostcodeListView, PostcodeRetrieveView, StateListView

urlpatterns = [
    path("", PostcodeListView.as_view(), name="postcodeListView"),
    path(r"<int:pk>/", PostcodeRetrieveView.as_view(), name="postcodeView"),
    path("state/", StateListView.as_view(), name="stateListView"),
]
