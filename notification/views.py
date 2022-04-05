from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from notification.models import Notification
from notification.serializers import NotificationSerializer


class NotificationView(generics.ListAPIView):
    queryset = Notification.objects.all().order_by("read", "-created_at")[:10]
    serializer_class = NotificationSerializer
    pagination_class = None


@api_view(["PATCH"])
def NotificationReadView(request):
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
    notification_list = list(Notification.objects.filter(id__in=ids))

    serializer = NotificationSerializer(
        notification_list, data=data_list, many=True, partial=True
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    result = Notification.objects.all().order_by("read", "-created_at")[:10]
    result_serializer = NotificationSerializer(result, many=True)
    return Response(result_serializer.data, status.HTTP_200_OK)
