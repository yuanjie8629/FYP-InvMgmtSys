from dataclasses import field
from rest_framework import serializers
from core.models import Users
from customer.models import Cust, CustPosReg, CustType
from customer.signals import cust_status_email
from postcode.models import Postcode
from postcode.serializers import PostcodeSerializer


class CustTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustType
        fields = "__all__"


class CustListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        ret = []
        for i in instance:
            for data in validated_data:
                status_change = False
                if i.id == data.get("id"):
                    for key, value in data.items():
                        if key == "id":
                            continue
                        if key == "is_active":
                            status_change = True
                        setattr(i, key, value)
            ret.append(i.save())
            if status_change:
                cust_status_email(i)

        return ret


class CustPosRegWriteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(write_only=True, required=False)
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
        list_serializer_class = CustListSerializer

    def create(self, validated_data):
        self.check_email(validated_data.get("email"))
        validated_data.update({"accept": True})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self.check_email(validated_data.get("email"), compare=instance.email)
        return super().update(instance, validated_data)

    def check_email(self, value, *args, **kwargs):
        compare = kwargs.get("compare")
        check_query = Users.objects.filter(email=value)
        print(check_query)
        if check_query.exists():
            if not compare or compare != value:
                raise serializers.ValidationError(
                    detail={
                        "error": {
                            "code": "duplicate_email",
                            "message": "Email already exists.",
                        }
                    }
                )
        return value


class CustPosRegSerializer(serializers.ModelSerializer):
    postcode = PostcodeSerializer(read_only=True)
    birthdate = serializers.DateField(input_formats=["%d-%m-%Y"], format="%d-%m-%Y")
    position = serializers.SlugRelatedField(slug_field="type", read_only=True)
    created_at = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )

    class Meta:
        model = CustPosReg
        exclude = ["last_update", "is_deleted"]


class CustPosRegPrevSerializer(serializers.ModelSerializer):
    position = serializers.SlugRelatedField(slug_field="type", read_only=True)
    created_at = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )

    class Meta:
        model = CustPosReg
        fields = [
            "id",
            "name",
            "position",
            "gender",
            "created_at",
            "phone_num",
            "accept",
        ]


class CustSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(write_only=True, required=False)
    cust_type = serializers.SlugRelatedField(slug_field="type", read_only=True)
    date_joined = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    last_update = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    order_value_per_month = serializers.DecimalField(
        decimal_places=2, max_digits=12, source="get_order_value_per_month"
    )
    last_order_dt = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", source="get_last_order_dt"
    )

    class Meta:
        model = Cust
        exclude = [
            "password",
            "username",
            "groups",
            "user_permissions",
            "is_staff",
            "is_superuser",
            "pos_reg",
        ]
        list_serializer_class = CustListSerializer


class CustPrevSerializer(serializers.ModelSerializer):
    cust_type = serializers.SlugRelatedField(slug_field="type", read_only=True)
    date_joined = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    order_value_per_month = serializers.DecimalField(
        decimal_places=2, max_digits=12, source="get_order_value_per_month"
    )
    last_order_dt = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", source="get_last_order_dt"
    )

    class Meta:
        model = Cust
        fields = [
            "id",
            "name",
            "email",
            "cust_type",
            "date_joined",
            "is_active",
            "order_value_per_month",
            "last_order_dt",
        ]
