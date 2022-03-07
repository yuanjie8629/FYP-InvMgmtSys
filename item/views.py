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

    def destroy(self, request, *args, **kwargs):
        ids = request.query_params.get("ids")
        if not ids:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = {"detail": "IDs are not found in request."}
            return response

        idList = [int(pk) for pk in ids.split(",")]
        invalidIds = []
        for i in idList:
            try:
                Item.objects.get(pk=i).delete()
            except Item.DoesNotExist:
                invalidIds.append(i)

        if invalidIds:
            response = Response(status=status.HTTP_404_NOT_FOUND)
            response.data = {
                "error": {
                    "code": "id_not_found",
                    "message": "The following IDs do not exist.",
                    "fields": invalidIds,
                }
            }
            return response

        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, *args, **kwargs):
        product = self.get_object()
        data = request.data
        itemData = {}
        productData = {}
        for key in data:
            if hasattr(product.item, key):
                itemData[key] = data[key]

            if hasattr(product, key):
                productData[key] = data[key]

        request.data.clear()
        request.data.update({"item": itemData, **productData})

        serializer = self.get_serializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ProductPrevView(generics.ListAPIView):
    queryset = Product.objects.filter(item__type="prod").select_related("item")

    serializer_class = ProductPrevSerializer
    filterset_class = ProductFilter

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
