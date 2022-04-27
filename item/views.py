import re
import cloudinary.uploader
import cloudinary
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Prefetch, F, Sum, Case, When, Q, FloatField
from django.db.models.functions import Coalesce, Cast
from django.http import QueryDict
from rest_framework import serializers, viewsets, generics, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from core.utils import get_date, update_request_data
from image.serializers import ImageSerializer
from item.choices import PROD_CAT
from item.filters import PackageFilter, ProductFilter
from item.models import Item, Package, Product
from item.serializers import (
    ItemSerializer,
    PackagePrevSerializer,
    PackageSerializer,
    PackageWriteSerializer,
    ProductPrevSerializer,
    ProductSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser


def validate_image(instance, request):
    data = request.data.copy()
    thumbnail = data.get("thumbnail")
    if not isinstance(thumbnail, InMemoryUploadedFile):
        data.pop("thumbnail", None)
    else:
        cloudinary.uploader.destroy(instance.thumbnail.public_id, invalidate=True)

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
            if ori_path == old:
                match = True
                break

        if not match:
            to_be_deleted.add(ori.id)

    if to_be_deleted:
        images = ori_images.filter(id__in=(to_be_deleted))
        for img in images:
            cloudinary.uploader.destroy(img.image.public_id, invalidate=True)
        img.delete()
        print("Deleted Images")
        print(to_be_deleted)

    for index, value in enumerate(new_images):
        data.update({"image[{}]".format(index): value})
        print("Adding new Images")
        print(new_images)

    return data


class ItemListView(generics.ListAPIView):
    image = ImageSerializer(many=True, required=False)
    thumbnail = serializers.ImageField()
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related("image").order_by("-last_update")
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        print(request)
        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        data = validate_image(self.get_object(), request)

        return super().partial_update(
            update_request_data(request, data), *args, **kwargs
        )

    @action(
        methods=["get"],
        detail=False,
        url_path=r"ranking/sales",
        url_name="ranking-sales",
    )
    def ranking_by_sales(self, request, pk=None):
        from_date, to_date = get_date(request)
        category = request.query_params.get("category", None)

        if category and not (
            category in dict(PROD_CAT).keys() or category in dict(PROD_CAT).values()
        ):
            return Response({"detail": "invalid_category"}, status.HTTP_400_BAD_REQUEST)

        product = (
            Product.objects.filter(category=category)
            if category
            else Product.objects.all()
        )

        product_ranking = product.values(
            "name",
            "category",
            sales=(
                Cast(
                    Coalesce(
                        Sum(
                            Case(
                                When(
                                    Q(
                                        order_line__order__created_at__range=(
                                            from_date,
                                            to_date,
                                        )
                                    )
                                    & Q(order_line__special_price__isnull=True),
                                    then=(
                                        F("order_line__quantity")
                                        * F("order_line__price")
                                    ),
                                ),
                                When(
                                    Q(
                                        order_line__order__created_at__range=(
                                            from_date,
                                            to_date,
                                        )
                                    )
                                    & Q(order_line__special_price__isnull=False),
                                    then=(
                                        F("order_line__quantity")
                                        * F("order_line__special_price")
                                    ),
                                ),
                            ),
                        ),
                        0,
                    ),
                    FloatField(),
                )
            ),
        ).order_by("-sales")

        page = self.paginate_queryset(product_ranking)
        if page is not None:
            return self.get_paginated_response(page)
        return Response(product_ranking, status.HTTP_200_OK)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"ranking/units",
        url_name="ranking-units",
    )
    def ranking_by_units(self, request, pk=None):
        from_date, to_date = get_date(request)
        category = request.query_params.get("category", None)

        if category and not (
            category in dict(PROD_CAT).keys() or category in dict(PROD_CAT).values()
        ):
            return Response({"detail": "invalid_category"}, status.HTTP_400_BAD_REQUEST)

        product = (
            Product.objects.filter(category=category)
            if category
            else Product.objects.all()
        )

        product_ranking = product.values(
            "name",
            "category",
            units=Coalesce(
                Sum(
                    Case(
                        When(
                            Q(
                                order_line__order__created_at__range=(
                                    from_date,
                                    to_date,
                                )
                            ),
                            then=F("order_line__quantity"),
                        )
                    )
                ),
                0,
            ),
        ).order_by("-units")

        page = self.paginate_queryset(product_ranking)
        if page is not None:
            return self.get_paginated_response(page)
        return Response(product_ranking, status.HTTP_200_OK)


class ProductPrevView(generics.ListAPIView):
    queryset = (
        Product.objects.all().prefetch_related("image").order_by(("-last_update"))
    )
    serializer_class = ProductPrevSerializer
    filterset_class = ProductFilter


class ProdPrevAllView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductPrevSerializer
    pagination_class = None


@api_view(["POST"])
def ItemBulkDeleteView(request):
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
def ProdBulkUpdView(request):
    if "list" in request.data:
        data_list = request.data.get("list")
    else:
        response = Response(status=status.HTTP_404_NOT_FOUND)
        response.data = {
            "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
        }
        return response

    ids = []
    for data in data_list:
        if "id" in data:
            ids.append(data.get("id"))
        else:
            response = Response(status=status.HTTP_404_NOT_FOUND)
            response.data = {
                "detail": "Please provide the product id as 'id' for each data."
            }
            return response

    product_list = list(Product.objects.select_related().filter(id__in=ids))
    serializer = ProductSerializer(
        product_list, data=data_list, many=True, partial=True
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(status=status.HTTP_200_OK, data=serializer.validated_data)


class PackageViewSet(viewsets.ModelViewSet):
    queryset = (
        Package.objects.all()
        .prefetch_related("image", "pack_item", Prefetch("pack_item__prod"))
        .order_by("-last_update")
    )
    serializer_class = PackageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        product_list = []
        for key, value in list(data.items()):
            if re.search("product\[\d\]", key):
                product_list.append(QueryDict(value))
                data.pop(key)
        data.update({"product": [prod.dict() for prod in product_list]})
        print(data)

        if not product_list:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "require_product",
                        "message": "Please add at least ONE product.",
                    }
                }
            )

        return super().create(update_request_data(request, data), *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        print(request.data)
        data = validate_image(self.get_object(), request)

        product_list = []
        for key, value in list(data.items()):
            if re.search("product\[\d\]", key):
                product_list.append(QueryDict(value))
                data.pop(key)
        if product_list:
            data.update({"product": [prod.dict() for prod in product_list]})
            print(data)

        return super().partial_update(
            update_request_data(request, data), *args, **kwargs
        )

    def get_serializer_class(self):
        if (
            self.action == "create"
            or self.action == "update"
            or self.action == "partial_update"
        ):
            return PackageWriteSerializer
        return PackageSerializer


class PackagePrevView(generics.ListAPIView):
    queryset = (
        Package.objects.all()
        .prefetch_related("image", "pack_item", Prefetch("pack_item__prod"))
        .order_by("-last_update")
    )
    serializer_class = PackagePrevSerializer
    filterset_class = PackageFilter


@api_view(["PATCH"])
def PackBulkUpdView(request):
    if "list" in request.data:
        data_list = request.data.get("list")
    else:
        response = Response(status=status.HTTP_404_NOT_FOUND)
        response.data = {
            "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
        }
        return response

    ids = []
    for data in data_list:
        if "id" in data:
            ids.append(data.get("id"))
        else:
            response = Response(status=status.HTTP_404_NOT_FOUND)
            response.data = {
                "detail": "Please provide the product id as 'id' for each data."
            }
            return response
    package_list = list(Package.objects.select_related().filter(id__in=ids))
    serializer = PackageWriteSerializer(
        package_list, data=data_list, many=True, partial=True
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(status=status.HTTP_200_OK, data=serializer.validated_data)


class PackSalesRankingView(generics.ListAPIView):
    queryset = (
        Package.objects.all()
        .prefetch_related("image", "pack_item", Prefetch("pack_item__prod"))
        .order_by("-last_update")
    )

    def list(self, request, *args, **kwargs):
        from_date, to_date = get_date(request)

        package = Package.objects.all()

        package_ranking = package.values(
            "name",
            sales=Cast(
                Coalesce(
                    Sum(
                        Case(
                            When(
                                Q(
                                    order_line__order__created_at__range=(
                                        from_date,
                                        to_date,
                                    )
                                )
                                & Q(order_line__special_price__isnull=True),
                                then=(
                                    F("order_line__quantity") * F("order_line__price")
                                ),
                            ),
                            When(
                                Q(
                                    order_line__order__created_at__range=(
                                        from_date,
                                        to_date,
                                    )
                                )
                                & Q(order_line__special_price__isnull=False),
                                then=(
                                    F("order_line__quantity")
                                    * F("order_line__special_price")
                                ),
                            ),
                        ),
                    ),
                    0,
                ),
                FloatField(),
            ),
        ).order_by("-sales")

        page = self.paginate_queryset(package_ranking)
        if page is not None:
            return self.get_paginated_response(page)
        return Response(package_ranking, status.HTTP_200_OK)


class PackUnitsRankingView(generics.ListAPIView):
    queryset = (
        Package.objects.all()
        .prefetch_related("image", "pack_item", Prefetch("pack_item__prod"))
        .order_by("-last_update")
    )

    def list(self, request, *args, **kwargs):
        from_date, to_date = get_date(request)

        package = Package.objects.all()

        package_ranking = package.values(
            "name",
            units=Coalesce(
                Sum(
                    Case(
                        When(
                            Q(
                                order_line__order__created_at__range=(
                                    from_date,
                                    to_date,
                                )
                            ),
                            then=F("order_line__quantity"),
                        )
                    )
                ),
                0,
            ),
        ).order_by("-units")

        page = self.paginate_queryset(package_ranking)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(package_ranking, status.HTTP_200_OK)
