from shipment.models import ShippingFee
from shipment.serializers import ShippingFeeSerializer


def calculate_ship_fee(total_weight, state):
    shipping_fee = ShippingFee.objects.filter(
        location__name=state,
        weight_start__lte=total_weight,
        weight_end__gte=total_weight,
    ).first()

    if not shipping_fee:
        weight_most_end = (
            ShippingFee.objects.filter(location__name=state)
            .order_by("-weight_end")
            .first()
        )
        if hasattr(weight_most_end, "sub_fee"):
            sub_fee = weight_most_end.sub_fee
        if hasattr(weight_most_end, "sub_weight"):
            sub_weight = weight_most_end.sub_weight
        ship_fee = weight_most_end.ship_fee
        weight_end = weight_most_end.weight_end
        remain_weight = total_weight - weight_end
        if sub_fee and sub_weight:
            shipping_fee = ship_fee + (remain_weight / sub_weight * sub_fee)
            return "{:.2f}".format(float(shipping_fee))
        return "0"
    serializer = ShippingFeeSerializer(shipping_fee)
    return "{:.2f}".format(float(serializer.data.get("ship_fee")))
