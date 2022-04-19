from django.db import models

from core.models import SoftDeleteModel


class Notification(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    type = models.CharField(max_length=30)
    read = models.BooleanField(blank=True, null=True, default=False)

    class Meta:
        db_table = "notification"

    def __str__(self):
        return "({} - {}) {}".format(self.id, self.type, self.title)
