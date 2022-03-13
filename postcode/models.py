from django.db import models

# Create your models here.
class Postcode(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=5)
    city = models.ForeignKey("City", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "postcode"


class City(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=45)
    state = models.ForeignKey("State", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "city"


class State(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=45)

    class Meta:
        db_table = "state"
