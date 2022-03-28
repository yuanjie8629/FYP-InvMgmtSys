from rest_framework import serializers
from order.models import Order
from payment.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = Payment
        exclude = ["last_update", "is_deleted"]
