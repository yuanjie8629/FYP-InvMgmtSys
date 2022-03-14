from rest_framework import serializers
from image.models import Image


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["image"]

    def to_representation(self, instance):
        request = self.context.get("request", None)
        if request is not None:
            return request.build_absolute_uri(instance.image.url)
        return instance.image.url

    def to_internal_value(self, data):
        data = {'image': data}
        return super().to_internal_value(data)
