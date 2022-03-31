from rest_framework import serializers
from customer.models import Cust
from item.models import Item
from order.models import Order, OrderLine
from shipment.models import Shipment
from shipment.serializers import PickupSerializer, ShipmentSerializer


class OrderLineSerializer(serializers.ModelSerializer):
    id = serializers.SlugRelatedField(slug_field="id", source="item", read_only=True)
    name = serializers.SlugRelatedField(
        slug_field="name", source="item", read_only=True
    )
    sku = serializers.SlugRelatedField(slug_field="sku", source="item", read_only=True)
    price = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    special_price = serializers.DecimalField(
        decimal_places=2, max_digits=10, read_only=True
    )
    thumbnail = serializers.ImageField(source="item.thumbnail", read_only=True)
    weight = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    quantity = serializers.IntegerField()
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), write_only=True
    )
    cust = serializers.PrimaryKeyRelatedField(
        queryset=Cust.objects.all(), required=False
    )

    class Meta:
        model = OrderLine
        fields = [
            "id",
            "name",
            "sku",
            "price",
            "special_price",
            "thumbnail",
            "weight",
            "quantity",
            "item",
            "cust",
        ]


class OrderSerializer(serializers.ModelSerializer):
    order_time = serializers.DateTimeField(
        input_formats=["%d-%m-%Y %H:%M"],
        format="%d-%m-%Y %H:%M",
        source="created_at",
        read_only=True,
    )
    shipment = serializers.SlugRelatedField(slug_field="type", read_only=True)
    track_num = serializers.SlugRelatedField(
        slug_field="track_num",
        source="shipment.shipment",
        queryset=Shipment.objects.select_related(),
    )
    cust_name = serializers.SlugRelatedField(
        slug_field="name", read_only=True, source="cust"
    )
    cust_type = serializers.SlugRelatedField(
        slug_field="type", read_only=True, source="cust.cust_type"
    )

    class Meta:
        model = Order
        exclude = ["created_at", "last_update", "is_deleted", "item", "voucher", "cust"]


class OrderWithShipmentSerializer(serializers.ModelSerializer):
    voucher = serializers.SlugRelatedField(
        slug_field="code",
        read_only=True,
        required=False,
    )
    item = OrderLineSerializer(many=True, source="order_line")
    shipment = ShipmentSerializer(source="shipment.shipment")
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, source="get_subtotal_price"
    )
    order_time = serializers.DateTimeField(
        input_formats=["%d-%m-%Y %H:%M"], format="%d-%m-%Y %H:%M", source="created_at"
    )

    class Meta:
        model = Order
        exclude = ["created_at", "last_update", "is_deleted"]


class OrderWithPickupSerializer(serializers.ModelSerializer):
    voucher = serializers.SlugRelatedField(
        slug_field="code",
        read_only=True,
        required=False,
    )
    item = OrderLineSerializer(many=True, source="order_line")
    pickup = PickupSerializer(source="shipment.pickup")
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, source="get_subtotal_price"
    )
    order_time = serializers.DateTimeField(
        input_formats=["%d-%m-%Y %H:%M"], format="%d-%m-%Y %H:%M", source="created_at"
    )

    class Meta:
        model = Order
        exclude = ["created_at", "last_update", "is_deleted", "shipment"]
