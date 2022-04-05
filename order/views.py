from datetime import datetime
from django.http import HttpResponse
from rest_framework import mixins, viewsets, status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.utils import generate_zip
from order.filters import OrderFilter
from order.models import Order
from order.serializers import (
    OrderSerializer,
    OrderWithPickupSerializer,
    OrderWithShipmentSerializer,
)
from reversion.models import Version
from order.utils import generate_invoice
from shipment.models import Pickup, Shipment
from voucher.models import Voucher


class OrderViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        Order.objects.all()
        .prefetch_related("item")
        .select_related(
            "cust__cust_type", "cust", "voucher", "shipment", "shipment__shipment"
        )
        .order_by("-created_at")
    )
    serializer_class = OrderSerializer
    filterset_class = OrderFilter

    def retrieve(self, request, *args, **kwargs):
        order = self.get_object()
        print(order)
        shipment = order.shipment
        if shipment.type == "shipping":
            print("shipping")
            serializer = OrderWithShipmentSerializer(order)

        else:
            print("pickup")
            serializer = OrderWithPickupSerializer(order)

        response = Response(serializer.data)
        code = response.data.get("voucher", None)
        if code:
            voucher = Voucher.objects.filter(code=code).first()

            if voucher:
                voucher_version = (
                    Version.objects.get_for_object(voucher)
                    .filter(revision__date_created__lte=order.created_at)
                    .order_by("-revision__date_created")
                    .first()
                )
                subtotal = response.data.get("subtotal", None)
                if voucher_version:
                    code = voucher_version.field_dict["code"]
                    if voucher_version.field_dict["type"] == "percentage":
                        total_discount = float(subtotal) * float(
                            voucher_version.field_dict["discount"]
                        )
                    else:
                        total_discount = voucher_version.field_dict["discount"]

                else:
                    if voucher.type == "percentage":
                        total_discount = float(subtotal) * float(voucher.discount)
                    else:
                        total_discount = voucher.discount

                response.data.update({"voucher": code})
                response.data.update(
                    {"discount": "{:.2f}".format(float(total_discount))}
                )
        return response


@api_view(["PATCH"])
def OrderTrackNumUpdView(request):
    if "list" in request.data:
        data_list = request.data.get("list")
    else:
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={
                "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
            },
        )

    ids = []
    for data in data_list:
        if "id" in data:
            ids.append(data.get("id"))
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Please provide the order id as 'id' for each data."},
            )

        if not "track_num" in data:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "detail": "Please provide the tracking number as 'track_num' for each data."
                },
            )

    order_list = list(Order.objects.select_related().filter(id__in=ids))
    print(order_list)
    for order in order_list:
        if not Shipment.objects.filter(order=order).exists():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"detail": "No shipment found for the order #{}".format(order.id)},
            )
        shipment = order.shipment.shipment
        for data in data_list:
            if order.id == data.get("id"):
                shipment.track_num = data.get("track_num")
                shipment.save(update_fields=["last_update", "track_num"])

                if order.status != "shipping":
                    order.status = "shipping"
                    order.save(update_fields=["last_update", "status"])
                else:
                    order.save(update_fields=["last_update"])

    serializer = OrderSerializer(order_list, many=True)

    return Response(status=status.HTTP_200_OK, data=serializer.data)


@api_view(["PATCH"])
def OrderPickupUpdView(request):
    if "list" in request.data:
        data_list = request.data.get("list")
    else:
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={
                "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
            },
        )

    ids = []
    for data in data_list:
        if "id" in data:
            ids.append(data.get("id"))
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Please provide the order id as 'id' for each data."},
            )

    order_list = list(Order.objects.select_related().filter(id__in=ids))
    print(order_list)
    for order in order_list:
        if not Pickup.objects.filter(order=order).exists():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"detail": "No pickup found for the order #{}".format(order.id)},
            )
        pickup = order.shipment.pickup
        for data in data_list:
            if order.id == data.get("id"):
                pickup.pickup_dt = datetime.now()
                pickup.save(update_fields=["last_update", "pickup_dt"])
                order.status = "completed"
                order.save(update_fields=["last_update", "status"])

    serializer = OrderSerializer(order_list, many=True)

    return Response(status=status.HTTP_200_OK, data=serializer.data)


def restore_product_quantity(instance):
    item = instance.item
    item.stock = item.stock + instance.quantity
    item.save()


@api_view(["PATCH"])
def OrderCancelView(request):
    if "list" in request.data:
        data_list = request.data.get("list")
    else:
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={
                "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
            },
        )

    ids = []
    for data in data_list:
        if "id" in data:
            ids.append(data.get("id"))
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Please provide the order id as 'id' for each data."},
            )

    order_list = list(Order.objects.select_related().filter(id__in=ids))

    for order in order_list:
        for data in data_list:
            if order.id == data.get("id"):
                order.status = "cancel"
                order.save(update_fields=["last_update", "status"])

    order_line = order.order_line.all()
    for ol in order_line:
        restore_product_quantity(ol)

    serializer = OrderSerializer(order_list, many=True)

    return Response(status=status.HTTP_200_OK, data=serializer.data)


@api_view(["POST"])
def BulkInvoicesView(request):
    if "ids" in request.data:
        data_list = request.data.get("ids")
    else:
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={
                "detail": "Please make sure to put the data with a 'list' key as {ids: [data]}"
            },
        )

    ids = [id for id in data_list]

    order_list = list(Order.objects.select_related().filter(id__in=ids))
    files = []

    for order in order_list:
        pdf = generate_invoice(order)
        files.append((order.id + ".pdf", pdf))

    full_zip_in_memory = generate_zip(files)

    response = HttpResponse(
        full_zip_in_memory, content_type="application/force-download"
    )
    response["Content-Disposition"] = 'attachment; filename="{}"'.format("invoices.zip")
    return response


class InvoiceView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = "id"

    def get(self, request, *args, **kwargs):
        order = self.get_object()
        pdf = generate_invoice(order)
        response = HttpResponse(pdf, content_type="application/force-download")
        response["Content-Disposition"] = 'attachment; filename="{}"'.format(
            "{}.zip".format(order.id)
        )
        return response
