from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.utils import update_request_data
from customer.models import CustType
from voucher.filters import VoucherFilter
from voucher.models import Voucher

from voucher.serializers import VoucherSerializer, VoucherWriteSerializer


class VoucherViewSet(viewsets.ModelViewSet):
    queryset = (
        Voucher.objects.all().prefetch_related("cust_type").order_by("-last_update")
    )
    serializer_class = VoucherSerializer
    filterset_class = VoucherFilter

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        cust_type = request.data.get("cust_type")
        cust_list = CustType.objects.filter(type__in=cust_type)
        data.update({"cust_type": [cust.id for cust in cust_list]})
        return super().create(update_request_data(request, data), *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        data = request.data.copy()
        cust_type = request.data.get("cust_type")
        if cust_type:
            cust_list = CustType.objects.filter(type__in=cust_type)
            data.update({"cust_type": [cust.id for cust in cust_list]})
        return super().partial_update(
            update_request_data(request, data), *args, **kwargs
        )

    def get_serializer_class(self):
        if (
            self.action == "create"
            or self.action == "update"
            or self.action == "partial_update"
        ):
            return VoucherWriteSerializer
        return VoucherSerializer


@api_view(["POST"])
def VoucherBulkDeleteView(request):
    ids = request.data.get("ids")
    if not ids:
        response = Response(status=status.HTTP_400_BAD_REQUEST)
        response.data = {"detail": "IDs are not found in request body."}
        return response

    idList = [int(pk) for pk in ids]
    invalidIds = []
    for i in idList:
        try:
            Voucher.objects.get(pk=i).delete()
        except Voucher.DoesNotExist:
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
def VoucherBulkUpdView(request):
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

    voucher_list = list(Voucher.objects.filter(id__in=ids))
    serializer = VoucherWriteSerializer(
        voucher_list, data=data_list, many=True, partial=True
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(status=status.HTTP_200_OK, data=serializer.validated_data)
