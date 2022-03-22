from rest_framework import serializers

from postcode.models import Postcode, State


class PostcodeSerializer(serializers.ModelSerializer):

    state = serializers.SlugRelatedField(
        slug_field="name", queryset=State.objects.all()
    )

    class Meta:
        model = Postcode
        exclude = ["id"]


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = "__all__"
