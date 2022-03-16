from rest_framework import serializers
from customer.models import CustType
from customer.serializers import CustTypeSerializer
from voucher.models import Voucher


def check_code(value, *args, **kwargs):
    print(value)
    compare = kwargs.get("compare")
    check_query = Voucher.objects_with_deleted.filter(code=value)
    if check_query.exists():
        if not compare or compare != value:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "invalid_code",
                        "message": "Voucher with this code already exists.",
                    }
                }
            )
    return value


class VoucherSerializer(serializers.ModelSerializer):
    cust_type = serializers.SlugRelatedField(
        many=True, slug_field="type", read_only=True
    )
    avail_start_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    avail_end_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", required=False
    )

    class Meta:
        model = Voucher
        exclude = [
            "is_deleted",
            "created_at",
            "last_update",
        ]
        extra_kwargs = {
            "code": {"validators": []},
        }


class VoucherListSerializer(serializers.ListSerializer):
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


class VoucherWriteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    cust_type = serializers.PrimaryKeyRelatedField(
        many=True,
        source="voucher_line",
        queryset=CustType.objects.all(),
        write_only=True,
    )
    avail_start_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    avail_end_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", required=False
    )

    class Meta:
        model = Voucher
        exclude = [
            "is_deleted",
            "created_at",
            "last_update",
        ]
        extra_kwargs = {
            "code": {"validators": []},
        }
        list_serializer_class = VoucherListSerializer

    def create(self, validated_data):
        if "code" in validated_data:
            check_code(validated_data.get("code"))
        voucher_line = validated_data.pop("voucher_line", None)
        voucher = Voucher.objects.create(**validated_data)
        voucher.cust_type.set(voucher_line)

        return voucher

    def update(self, instance, validated_data):
        print(validated_data)
        if "code" in validated_data:
            check_code(validated_data.get("code"), compare=instance.code)

        voucher_line = validated_data.pop("voucher_line", None)
        for key in validated_data:
            setattr(instance, key, validated_data[key])
        instance.save()
        if voucher_line:
            instance.cust_type.set(voucher_line)

        return instance
