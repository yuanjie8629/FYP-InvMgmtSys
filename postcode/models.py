from django.db import models
from postgres_copy import CopyManager

class State(models.Model):
    objects = CopyManager()
    code = models.CharField(primary_key=True, max_length=3)
    name = models.CharField(max_length=45)

    class Meta:
        db_table = "state"

class Postcode(models.Model):
    objects = CopyManager()
    id = models.AutoField(primary_key=True)
    postcode = models.CharField(max_length=5)
    city= models.CharField(max_length=50)
    state = models.ForeignKey(State, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "postcode"
