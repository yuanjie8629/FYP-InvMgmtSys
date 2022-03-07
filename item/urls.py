from django.urls import include, path
from rest_framework.routers import DefaultRouter
from core.routers import CustomRouter

from item.views import ProductPrevView, ProductViewSet

router = CustomRouter()
router.register(r"product", ProductViewSet)


urlpatterns = [path(r"product/prev", ProductPrevView.as_view(), name="productPrev")]


urlpatterns += router.urls
