from enum import unique
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

GENDER_CHOICES = (
    ("M", "Male"),
    ("F", "Female"),
)

class Admin(AbstractUser):
    admin_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(unique=True, max_length=45)
    password = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    phone_num = models.CharField(max_length=15)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=1, blank=True, null=True, choices=GENDER_CHOICES
    )
    first_name = None
    last_name = None

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    class Meta:
        db_table = "admin"


class Cart(models.Model):
    cart_id = models.IntegerField(primary_key=True)
    created_tms = models.DateTimeField()
    last_update = models.DateTimeField()
    cust = models.ForeignKey("CustAcc", on_delete=models.CASCADE)

    class Meta:
        db_table = "cart"


class CartItem(models.Model):
    cart_item_id = models.IntegerField(primary_key=True)
    quantity = models.IntegerField()
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    item = models.ForeignKey("Item", on_delete=models.CASCADE)

    class Meta:
        db_table = "cart_item"


class City(models.Model):
    city_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=45)
    state = models.ForeignKey("State", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "city"


class Courier(models.Model):
    courier_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "courier"


class CustAcc(models.Model):
    cust_id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=45)
    password = models.CharField(max_length=255)
    status = models.CharField(max_length=20)
    cust_type = models.ForeignKey("CustType", on_delete=models.DO_NOTHING)
    pos_reg = models.ForeignKey(
        "CustPosReg", on_delete=models.DO_NOTHING, blank=True, null=True
    )

    class Meta:
        db_table = "cust_acc"


class CustPosDeclar(models.Model):
    pos_decl_id = models.IntegerField(primary_key=True)
    answer = models.CharField(max_length=300)
    pos_reg = models.ForeignKey("CustPosReg", on_delete=models.CASCADE)
    pos_declar_ques = models.ForeignKey("CustPosDeclarQues", on_delete=models.CASCADE)

    class Meta:
        db_table = "cust_pos_declar"


class CustPosDeclarQues(models.Model):
    pos_declar_ques_id = models.IntegerField(primary_key=True)
    ques = models.CharField(max_length=300)

    class Meta:
        db_table = "cust_pos_declar_ques"


class CustPosReg(models.Model):
    pos_reg_id = models.AutoField(primary_key=True)
    ic_num = models.CharField(max_length=15)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=15)
    gender = models.CharField(max_length=1)
    birthdate = models.DateField()
    address = models.CharField(max_length=255)
    position = models.CharField(max_length=30)
    marital_status = models.CharField(max_length=20)
    occupation = models.CharField(max_length=45, blank=True, null=True)
    comp_name = models.CharField(max_length=100, blank=True, null=True)
    reg_dt = models.DateTimeField()
    accept = models.IntegerField()
    accepted_by = models.ForeignKey(
        Admin, on_delete=models.DO_NOTHING, db_column="accepted_by"
    )
    postal = models.ForeignKey("Postcode", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "cust_pos_reg"


class CustProfile(models.Model):
    cust = models.OneToOneField(CustAcc, models.DO_NOTHING, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)

    class Meta:
        db_table = "cust_profile"


class CustType(models.Model):
    cust_type_id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = "cust_type"


class Image(models.Model):
    img_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=300)

    class Meta:
        db_table = "image"


class ImageLine(models.Model):
    img_line_id = models.IntegerField(primary_key=True)
    img = models.ForeignKey(Image, on_delete=models.CASCADE)
    item = models.ForeignKey("Item", on_delete=models.CASCADE)

    class Meta:
        db_table = "image_line"


class Item(models.Model):
    item_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20)
    description = models.TextField()
    status = models.CharField(max_length=20)
    thumbnail = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    sku = models.CharField(max_length=45)
    stock = models.IntegerField()
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    length = models.DecimalField(max_digits=8, decimal_places=2)
    width = models.DecimalField(max_digits=8, decimal_places=2)
    height = models.DecimalField(max_digits=8, decimal_places=2)
    last_update = models.DateTimeField()

    class Meta:
        db_table = "item"


class Order(models.Model):
    order_id = models.IntegerField(primary_key=True)
    created_tms = models.DateTimeField()
    total_amt = models.DecimalField(max_digits=10, decimal_places=2)
    ship_type = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    cust = models.ForeignKey(CustAcc, on_delete=models.DO_NOTHING)
    voucher = models.ForeignKey(
        "Voucher", on_delete=models.DO_NOTHING, blank=True, null=True
    )

    class Meta:
        db_table = "order"


class OrderLine(models.Model):
    order_line_id = models.IntegerField(primary_key=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "order_line"


class OrderShipment(models.Model):
    order_ship_id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=20)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "order_shipment"


class Package(models.Model):
    pack = models.OneToOneField(Item, on_delete=models.CASCADE, primary_key=True)
    avail_start_tm = models.DateTimeField()
    avail_end_tm = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "package"


class PackageItem(models.Model):
    pack_item_id = models.IntegerField(primary_key=True)
    quantity = models.IntegerField(blank=True, null=True)
    pack = models.ForeignKey(Package, on_delete=models.CASCADE)
    prod = models.ForeignKey("Product", on_delete=models.CASCADE)

    class Meta:
        db_table = "package_item"


class Payment(models.Model):
    payment_id = models.IntegerField(primary_key=True)
    method = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.IntegerField()
    reference_num = models.CharField(max_length=50)
    created_tms = models.DateTimeField()
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "payment"


class Pickup(models.Model):
    pickup = models.OneToOneField(
        OrderShipment, on_delete=models.CASCADE, primary_key=True
    )
    pickup_dt = models.DateTimeField()
    pickup_loc = models.ForeignKey("PickupLoc", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "pickup"


class PickupLoc(models.Model):
    pickup_loc_id = models.IntegerField(primary_key=True)
    location = models.CharField(max_length=50)

    class Meta:
        db_table = "pickup_loc"


class Postcode(models.Model):
    postal_id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=5)
    city = models.ForeignKey(City, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "postcode"


class Product(models.Model):
    product = models.OneToOneField(Item, on_delete=models.CASCADE, primary_key=True)
    category = models.CharField(max_length=30)
    cost_per_unit = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    ordering_cost = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    holding_cost = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    avg_lead_tm = models.IntegerField(blank=True, null=True)
    max_lead_tm = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "product"


class Review(models.Model):
    review_id = models.IntegerField(primary_key=True)
    rating = models.IntegerField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    created_tms = models.DateTimeField(blank=True, null=True)
    cust = models.ForeignKey(
        CustAcc, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    item = models.ForeignKey(Item, on_delete=models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = "review"


class Shipment(models.Model):
    ship = models.OneToOneField(
        OrderShipment, on_delete=models.CASCADE, primary_key=True
    )
    created_tms = models.DateTimeField()
    track_num = models.CharField(max_length=50)
    address = models.ForeignKey("ShippingAddress", on_delete=models.DO_NOTHING)
    ship_fee = models.ForeignKey("ShippingFee", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipment"


class ShippingAddress(models.Model):
    address_id = models.IntegerField(primary_key=True)
    address = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=100)
    contact_num = models.CharField(max_length=15)
    default = models.IntegerField(blank=True, null=True)
    postal = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)
    cust = models.ForeignKey(CustAcc, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipping_address"


class ShippingFee(models.Model):
    ship_fee_id = models.IntegerField(primary_key=True)
    location = models.CharField(max_length=45)
    weight_start = models.DecimalField(max_digits=8, decimal_places=2)
    weight_end = models.DecimalField(max_digits=8, decimal_places=2)
    ship_fee = models.DecimalField(max_digits=10, decimal_places=2)
    courier = models.ForeignKey(Courier, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipping_fee"


class State(models.Model):
    state_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=45)

    class Meta:
        db_table = "state"


class Voucher(models.Model):
    voucher_id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    min_spend = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    max_discount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    total_amt = models.IntegerField()
    usage_limit = models.IntegerField()
    avail_start_tm = models.DateTimeField()
    avail_end_tm = models.DateTimeField(blank=True, null=True)
    last_update = models.DateTimeField()

    class Meta:
        db_table = "voucher"


class VoucherLine(models.Model):
    voucher_line_id = models.IntegerField(primary_key=True)
    voucher = models.ForeignKey(Voucher, on_delete=models.CASCADE)
    cust_type = models.ForeignKey(CustType, on_delete=models.CASCADE)

    class Meta:
        db_table = "voucher_line"


class Wishlist(models.Model):
    wishlist_id = models.IntegerField(primary_key=True)
    created_tms = models.DateTimeField()
    last_update = models.DateTimeField()
    cust = models.ForeignKey(CustAcc, on_delete=models.CASCADE)

    class Meta:
        db_table = "wishlist"


class WishlistItem(models.Model):
    wishlist_item_id = models.IntegerField(primary_key=True)
    wishlist = models.ForeignKey(Wishlist, models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "wishlist_item"
