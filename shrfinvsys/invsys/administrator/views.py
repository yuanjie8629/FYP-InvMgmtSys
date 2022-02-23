from rest_framework import generics
from administrator.models import Admin

from .serializers import AdminSerializer


class AdminList(generics.ListCreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer


class AdminDetails(generics.RetrieveDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = "username"
