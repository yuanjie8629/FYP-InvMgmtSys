from uuid import uuid4
from django.db import models
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from simple_history.models import HistoricalRecords

def upload_to(instance, filename):
    # upload_to = "{}/{}".format(instance.type, instance.name)
    return "images/{}.{}".format(uuid4().hex, filename.split(".")[-1])


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    image = ProcessedImageField(
        blank=True,
        upload_to=upload_to,
        processors=[ResizeToFill(700, 700)],
        format="JPEG",
        options={"quality": 80},
    )
    history = HistoricalRecords(table_name="image_history")

    class Meta:
        db_table = "image"
