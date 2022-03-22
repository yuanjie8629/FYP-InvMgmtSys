from rest_framework import generics
from postcode.filters import PostcodeFilter
from postcode.models import Postcode, State
from postcode.serializers import PostcodeSerializer, StateSerializer


class PostcodeListView(generics.ListAPIView):
    queryset = Postcode.objects.all().prefetch_related("state")
    serializer_class = PostcodeSerializer
    pagination_class = None
    filterset_class = PostcodeFilter


class PostcodeRetrieveView(generics.RetrieveAPIView):
    queryset = Postcode.objects.all().prefetch_related("state")
    serializer_class = PostcodeSerializer


class StateListView(generics.ListAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    pagination_class = None
