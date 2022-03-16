from django.db import models
# from address.models import Postcode

from administrator.models import Admin



# Create your models here.
class CustAcc(models.Model):
    id = models.AutoField(primary_key=True)
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
    id = models.AutoField(primary_key=True)
    answer = models.CharField(max_length=300)
    pos_reg = models.ForeignKey("CustPosReg", on_delete=models.CASCADE)
    pos_declar_ques = models.ForeignKey("CustPosDeclarQues", on_delete=models.CASCADE)

    class Meta:
        db_table = "cust_pos_declar"


class CustPosDeclarQues(models.Model):
    id = models.AutoField(primary_key=True)
    ques = models.CharField(max_length=300)

    class Meta:
        db_table = "cust_pos_declar_ques"


class CustPosReg(models.Model):
    id = models.AutoField(primary_key=True)
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
    # postal = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)

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
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = "cust_type"