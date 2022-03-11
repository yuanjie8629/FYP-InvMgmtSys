from django.urls import include, path
from rest_framework.routers import DefaultRouter

from image.views import ImageViewSet


router = DefaultRouter()
router.register(r"image", ImageViewSet)

urlpatterns = router.urls
