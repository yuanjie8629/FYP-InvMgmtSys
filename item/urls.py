from django.urls import include, path
from rest_framework.routers import DefaultRouter

from item.views import ProductPrevView, ProductViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet)


urlpatterns = [path("products/prev/", ProductPrevView.as_view(), name="productPrev")]


urlpatterns += router.urls
