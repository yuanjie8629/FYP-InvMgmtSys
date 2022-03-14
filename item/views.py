from ast import For
import re
from django import views
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.utils import update_request_data
from item.filters import ProductFilter
from item.models import Item, Package, Product
from item.serializers import (
    ItemSerializer,
    PackagePrevSerializer,
    PackageSerializer,
    ProductPrevSerializer,
    ProductSerializer,
)
from urllib.parse import urlparse
from collections import OrderedDict


def validate_image(instance, request):
    data = request.data.copy()
    thumbnail = data.get("thumbnail")
    if not isinstance(thumbnail, InMemoryUploadedFile):
        data.pop("thumbnail", None)

    ori_images = instance.image.all()
    new_images = []
    old_images = []
    to_be_deleted = set()

    for key, value in list(data.items()):
        if re.search("image\[\d\]", key):
            print(key)

            if isinstance(value, InMemoryUploadedFile):
                print("add new image")
                new_images.append(value)

            else:
                old_images.append(value)
            data.pop(key, None)

    for ori in ori_images:
        ori_path = ori.image.url
        match = False
        for old in old_images:
            path = urlparse(old).path

            if ori_path == path:
                match = True
                break

        if not match:
            to_be_deleted.add(ori.id)

    if to_be_deleted:
        ori_images.filter(id__in=(to_be_deleted)).delete()
        print("Deleted Images")
        print(to_be_deleted)

    for index, value in enumerate(new_images):
        data.update({"image[{}]".format(index): value})
        print("Adding new Images")
        print(new_images)

    return data


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related("image")
    serializer_class = ProductSerializer

    def partial_update(self, request, *args, **kwargs):
        data = validate_image(self.get_object(), request)

        return super().partial_update(
            update_request_data(request, data), *args, **kwargs
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        super().perform_destroy(instance.item)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductPrevView(generics.ListAPIView):
    queryset = (
        Product.objects.all().prefetch_related("image").order_by(("-last_update"))
    )
    serializer_class = ProductPrevSerializer
    filterset_class = ProductFilter


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
    if "list" in request.data:
        dataList = request.data.get("list")
    else:
        response = Response(status=status.HTTP_404_NOT_FOUND)
        response.data = {
            "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
        }
        return response

    ids = []
    for data in dataList:
        if "id" in data:
            ids.append(data.get("id"))
        else:
            response = Response(status=status.HTTP_404_NOT_FOUND)
            response.data = {
                "detail": "Please provide the product id as 'id' for each data."
            }
            return response

    product_list = list(Product.objects.select_related().filter(id__in=ids))
    serializer = ProductSerializer(product_list, data=dataList, many=True, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(status=status.HTTP_200_OK, data=serializer.validated_data)


class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

    def partial_update(self, request, *args, **kwargs):
        data = validate_image(self.get_object(), request)

        return super().partial_update(
            update_request_data(request, data), *args, **kwargs
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        super().perform_destroy(instance.item)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PackagePrevView(generics.ListAPIView):
    queryset = Package.objects.all().prefetch_related("image")
    serializer_class = PackagePrevSerializer


class ProdPrevAllView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductPrevSerializer
    pagination_class = None
