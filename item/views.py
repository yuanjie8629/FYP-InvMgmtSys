from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from item.filters import ProductFilter
from item.models import Item, Product
from item.serializers import ProductPrevSerializer, ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related("item")
    serializer_class = ProductSerializer

    def list(self, request):
        response = {"message": "List function is not offered in this path."}
        return Response(response, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        qs: QuerySet = self.get_queryset(*args, **kwargs)
        qs.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductPrevView(generics.ListAPIView):
    queryset = Product.objects.filter(item__type="prod").select_related("item")

    serializer_class = ProductPrevSerializer
    filterset_class = ProductFilter

    @method_decorator(cache_page(60 * 60 * 1))  # 1-day cache
    @method_decorator(
        vary_on_headers(
            "Authorization",
        )
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
