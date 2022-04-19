from uuid import uuid4
from django.db import models
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from cloudinary.models import CloudinaryField


def upload_to(instance, filename):
    # upload_to = "{}/{}".format(instance.type, instance.name)
    return "images/{}.{}".format(uuid4().hex, filename.split(".")[-1])


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    # image = ProcessedImageField(
    #     blank=True,
    #     upload_to=upload_to,
    #     processors=[ResizeToFill(700, 700)],
    #     format="JPEG",
    #     options={"quality": 80},
    # )
    image = CloudinaryField("image", width_field='700', height_field='700')

    class Meta:
        db_table = "image"
    
    def __str__(self):
        return "{}".format(self.image)
        
