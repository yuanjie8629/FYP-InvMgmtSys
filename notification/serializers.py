from rest_framework import serializers
from notification.models import Notification


class NotificationListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        ret = []
        for i in instance:
            for data in validated_data:
                if i.id == data.get("id"):
                    for key, value in data.items():
                        if key == "id":
                            continue
                        setattr(i, key, value)
            ret.append(i.save())

        return ret


class NotificationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    title = serializers.CharField(read_only=True)
    type = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M", read_only=True)
    read = serializers.BooleanField()

    class Meta:
        model = Notification
        fields = ["id", "title", "description", "type", "read", "created_at"]
        list_serializer_class = NotificationListSerializer

    def create(self, validated_data):
        print(validated_data)
        return super().create(validated_data)
