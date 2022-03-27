from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from postcode.serializers import StateSerializer
from shipment.filters import PickupLocFilter, ShippingFeeFilter
from shipment.serializers import PickupLocSerializer, ShippingFeeSerializer
from shipment.models import PickupLoc, ShippingFee
from postcode.models import State
from cacheops import invalidate_model


class ShippingFeeViewSet(viewsets.ModelViewSet):
    queryset = (
        ShippingFee.objects.all().prefetch_related("location").order_by("-last_update")
    )
    serializer_class = ShippingFeeSerializer
    filterset_class = ShippingFeeFilter

    def create(self, request, *args, **kwargs):
        location = request.data.pop("location", None)
        sub_fee = request.data.pop("sub_fee", None)
        sub_weight = request.data.pop("sub_weight", None)
        list = []
        data_list = request.data.pop("list")
        if location:
            for data in data_list:
                weight_start = data.get("weight_start")
                weight_end = data.get("weight_end")
                ship_fee = data.get("ship_fee")
                if weight_start > weight_end:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST,
                        data={"details": "invalid_weight"},
                    )

                if data == data_list[-1] and sub_fee and sub_weight:
                    list.append(
                        {
                            "location": location,
                            "weight_start": weight_start,
                            "weight_end": weight_end,
                            "ship_fee": ship_fee,
                            "sub_fee": sub_fee,
                            "sub_weight": sub_weight,
                        }
                    )
                else:
                    list.append(
                        {
                            "location": location,
                            "weight_start": weight_start,
                            "weight_end": weight_end,
                            "ship_fee": ship_fee,
                        }
                    )

        serializer = ShippingFeeSerializer(data=list, many=True)
        serializer.is_valid(raise_exception=True)
        ShippingFee.objects.filter(location__name=location).delete()
        serializer.save()
        invalidate_model(State)
        return Response(status=status.HTTP_200_OK)

    def paginate_queryset(self, queryset, view=None):
        if "no_page" in self.request.query_params:
            return None
        else:
            return self.paginator.paginate_queryset(queryset, self.request, view=self)


class ShippingFeeStateListView(generics.ListAPIView):
    queryset = State.objects.all().exclude(
        pk__in=ShippingFee.objects.values_list("location")
    )
    serializer_class = StateSerializer
    pagination_class = None


@api_view(["POST"])
def ShippingFeeBulkDeleteView(request):
    ids = request.data.get("ids")
    if not ids:
        response = Response(status=status.HTTP_400_BAD_REQUEST)
        response.data = {"detail": "IDs are not found in request body."}
        return response

    idList = [int(pk) for pk in ids]
    invalidIds = []
    for i in idList:
        try:
            ShippingFee.objects.get(pk=i).delete()
        except ShippingFee.DoesNotExist:
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


class PickupLocViewSet(viewsets.ModelViewSet):
    queryset = PickupLoc.objects.all().order_by("-last_update")
    serializer_class = PickupLocSerializer
    filterset_class = PickupLocFilter


@api_view(["POST"])
def PickupLocBulkDeleteView(request):
    ids = request.data.get("ids")
    if not ids:
        response = Response(status=status.HTTP_400_BAD_REQUEST)
        response.data = {"detail": "IDs are not found in request body."}
        return response

    idList = [int(pk) for pk in ids]
    invalidIds = []
    for i in idList:
        try:
            PickupLoc.objects.get(pk=i).delete()
        except PickupLoc.DoesNotExist:
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
