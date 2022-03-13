import re
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import generics
from rest_framework.decorators import parser_classes
from core.utils import dict_to_querydict
from item.filters import ProductFilter
from item.models import Item, Product
from item.serializers import ProductPrevSerializer, ProductSerializer
from image.models import Image
from urllib.parse import urlparse


class ProductViewSet(viewsets.ModelViewSet):
    queryset = (
        Product.objects.select_related()
        .filter(item__is_deleted=False, item__type="prod")
        .prefetch_related("item__image")
    )
    serializer_class = ProductSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        item = instance.item
        request.data._mutable = True

        thumbnail = request.data.get("thumbnail")
        print(isinstance(thumbnail, InMemoryUploadedFile))
        if not isinstance(thumbnail, InMemoryUploadedFile):
            print("hehehe")
            request.data.pop("thumbnail", None)
        print("thumbnail: ")
        print(request.data)

        ori_images = item.image.all()
        image_list = []
        removed_images = []
        to_be_deleted = []

        for key, value in list(request.data.items()):
            if re.search("image\[\d\]", key):
                if isinstance(value, InMemoryUploadedFile):
                    image_list.append(value)
                else:
                    request.data.pop(key)
                    path = urlparse(value).path
                    for ori in ori_images:
                        ori_path = ori.image.url
                        if ori_path != path:
                            print("ori: " + ori_path)
                            print("path: " + path)
                            to_be_deleted.append(ori.img_id)
                        else:
                            print("not same: " + ori_path)
                            print("not same path: " + path)
                            removed_images.append(ori)
        ori_images.filter(img_id__in=to_be_deleted).delete()

        for index, value in enumerate(image_list):
            setattr(request.data, "image[{}]".format(index), value)

        print("final: ")
        print(request.data)
        request.data._mutable = False

        return super().update(request, partial=True, *args, **kwargs)


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

    products = []
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

    product_list = list(
        Product.objects.select_related().filter(item__is_deleted=False, item_id__in=ids)
    )

    for data in dataList:
        for product in product_list:
            if product.pk == data.get("id"):
                new_data = {"item_id": data.pop("id")}
                for key in data:
                    if hasattr(product.item, key):
                        new_data.update({key: data[key]})

                    if hasattr(product, key):
                        new_data.update({key: data[key]})

                products.append(new_data)

    serializer = ProductSerializer(product_list, data=products, many=True, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(status=status.HTTP_200_OK, data=serializer.validated_data)


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
