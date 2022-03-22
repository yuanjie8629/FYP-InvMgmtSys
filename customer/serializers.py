from dataclasses import field
from rest_framework import serializers
from customer.models import Cust, CustPosReg, CustType
from postcode.models import Postcode
from postcode.serializers import PostcodeSerializer


class CustTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustType
        fields = "__all__"


class CustPosRegWriteSerializer(serializers.ModelSerializer):
    postcode = serializers.SlugRelatedField(
        slug_field="postcode", queryset=Postcode.objects.all()
    )
    birthdate = serializers.DateField(input_formats=["%d-%m-%Y"], format="%d-%m-%Y")
    position = serializers.SlugRelatedField(
        slug_field="type", queryset=CustType.objects.all()
    )

    class Meta:
        model = CustPosReg
        exclude = ["last_update", "is_deleted"]

    def create(self, validated_data):
        validated_data.update({"accept": True})
        return super().create(validated_data)


class CustPosRegSerializer(serializers.ModelSerializer):
    postcode = PostcodeSerializer(read_only=True)
    birthdate = serializers.DateField(input_formats=["%d-%m-%Y"], format="%d-%m-%Y")
    position = serializers.SlugRelatedField(
        slug_field="type", source="cust_type", read_only=True
    )

    class Meta:
        model = CustPosReg
        exclude = ["last_update", "is_deleted"]


class CustListSerializer(serializers.ListSerializer):
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


class CustSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="get_id", read_only=True)
    id = serializers.IntegerField(write_only=True, required=False)
    cust_type = serializers.SlugRelatedField(slug_field="type", read_only=True)
    pos_reg = CustPosRegSerializer()
    date_joined = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    # sales_per_month = serializers.DecimalField(decimal_places=2,max_digits=12)
    # last_order_date = serializers.DateField(input_formats=["%d-%m-%Y"], format="%d-%m-%Y")

    class Meta:
        model = Cust
        exclude = [
            "password",
            "username",
            "groups",
            "user_permissions",
            "is_staff",
            "is_superuser",
        ]
        list_serializer_class = CustListSerializer


class CustPrevSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="get_id")
    cust_type = serializers.SlugRelatedField(slug_field="type", read_only=True)
    date_joined = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    # sales_per_month = serializers.DecimalField(decimal_places=2,max_digits=12)
    # last_order_date = serializers.DateField(input_formats=["%d-%m-%Y"], format="%d-%m-%Y")

    class Meta:
        model = Cust
        fields = ["id", "name", "cust_type", "date_joined", "is_active"]
