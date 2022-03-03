from django.db import models

from item.models import Item


class Image(models.Model):
    img_id = models.IntegerField(primary_key=True)
    image = models.URLField(max_length=300)

    class Meta:
        db_table = "image"


class ImageLine(models.Model):
    img_line_id = models.IntegerField(primary_key=True)
    img = models.ForeignKey(Image, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "image_line"
