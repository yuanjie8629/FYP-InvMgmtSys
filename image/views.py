from django.shortcuts import render
from rest_framework import viewsets
from image.models import Image

from image.serializers import ImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = [MultiPartParser, FormParser]