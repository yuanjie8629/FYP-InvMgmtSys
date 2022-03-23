from numpy import generic
from rest_framework import viewsets, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from customer.filters import CustFilter, CustPosRegFilter
from customer.models import Cust, CustPosReg
from customer.serializers import (
    CustPosRegPrevSerializer,
    CustPosRegSerializer,
    CustPrevSerializer,
    CustSerializer,
    CustPosRegWriteSerializer,
    CustSerializer,
)


class CustView(viewsets.ModelViewSet):
    queryset = (
        Cust.objects.all()
        .select_related("cust_type", "pos_reg__position", "pos_reg__postcode")
        .order_by("-last_update")
    )
    serializer_class = CustSerializer
    filterset_class = CustFilter

    def get_serializer_class(self):
        if (
            self.action == "create"
            or self.action == "update"
            or self.action == "partial_update"
        ):
            return CustPosRegWriteSerializer
        elif self.action == "list":
            return CustPrevSerializer
        else:
            return CustSerializer


class CustPosRegView(generics.ListAPIView):
    queryset = (
        CustPosReg.objects.all().select_related("position").order_by("-last_update")
    )
    serializer_class = CustPosRegPrevSerializer
    filterset_class = CustPosRegFilter


class CustPosRegDetailsView(generics.RetrieveAPIView):
    queryset = (
        CustPosReg.objects.all().select_related("position").order_by("-last_update")
    )
    serializer_class = CustPosRegSerializer


@api_view(["PATCH"])
def CustStatusUpdView(request):
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
                "detail": "Please provide the customer id as 'id' for each data."
            }
            return response

    data_list = [
        {"id": data.get("id"), "is_active": data.get("is_active")} for data in data_list
    ]
    cust_list = list(Cust.objects.select_related().filter(id__in=ids))
    serializer = CustSerializer(cust_list, data=data_list, many=True, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(status=status.HTTP_200_OK, data=serializer.validated_data)


@api_view(["PATCH"])
def CustRegUpdView(request):
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
                "detail": "Please provide the customer id as 'id' for each data."
            }
            return response

    data_list = [
        {"id": data.get("id"), "accept": data.get("accept")} for data in data_list
    ]
    cust_list = list(CustPosReg.objects.select_related().filter(id__in=ids))
    serializer = CustPosRegWriteSerializer(
        cust_list, data=data_list, many=True, partial=True
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(status=status.HTTP_200_OK, data=serializer.validated_data)
