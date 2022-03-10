from django.db import transaction
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import generics
from item.filters import ProductFilter
from item.models import Item, Product
from item.serializers import ProductPrevSerializer, ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("item").filter(item__is_deleted=False)
    serializer_class = ProductSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance.item)
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
        print(serializer.validated_data)
        (serializer.save()).refresh_from_db()
        return Response(serializer.data)


@api_view(["POST"])
def prodBulkDeleteView(request):
    ids = request.data.get("ids")
    if not ids:
        response = Response(status=status.HTTP_400_BAD_REQUEST)
        response.data = {"detail": "IDs are not found in request body."}
        return response

    idList = [int(pk) for pk in ids]
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


@api_view(["PATCH"])
def prodBulkUpdView(request):
    try:
        dataList = request.data.get("list")
        products = []
        prodFields = []
        items = []
        itemFields = []

        for data in dataList:

            product = Product.objects.get(pk=data.pop("id"))

            for key in data:
                if hasattr(product.item, key):
                    print("item ", key)
                    setattr(product.item, key, data[key])
                    itemFields.append(key)

                if hasattr(product, key):
                    print("product  ", key)
                    setattr(product, key, data[key])
                    prodFields.append(key)

            products.append(product)
            items.append(product.item)

        if not (prodFields or itemFields):
            response = Response(status=status.HTTP_404_NOT_FOUND)
            response.data = {"detail": "No valid data to update."}
            return response

        if prodFields:
            Product.objects.bulk_update(products, prodFields)
        if itemFields:
            Item.objects.bulk_update(items, itemFields)

        return Response(status=status.HTTP_200_OK)

    except (TypeError, AttributeError):
        response = Response(status=status.HTTP_404_NOT_FOUND)
        response.data = {
            "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
        }
        return response

    except KeyError:
        response = Response(status=status.HTTP_404_NOT_FOUND)
        response.data = {
            "detail": "Please provide the product id as 'id' for each data."
        }
        return response


class ProductPrevView(generics.ListAPIView):
    queryset = (
        Product.objects.select_related()
        .filter(item__is_deleted=False)
        .filter(item__type="prod")
        .order_by(("-item__last_update"))
    )

    serializer_class = ProductPrevSerializer
    filterset_class = ProductFilter

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
