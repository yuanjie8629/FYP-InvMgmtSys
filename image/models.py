
from django.db import models


class Image(models.Model):
    img_id = models.AutoField(primary_key=True)
    image = models.ImageField(blank=True)

    class Meta:
        db_table = "image"


