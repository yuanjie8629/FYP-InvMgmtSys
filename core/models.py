from django.db import models
from core.managers import PolySoftDeleteManager, SoftDeleteManager
from cacheops import invalidate_model
from django.contrib.auth.models import AbstractUser

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class AuthModel(AbstractUser):
    first_name = None
    last_name = None
    class Meta:
        abstract=True

class SoftDeleteModel(BaseModel):
    is_deleted = models.BooleanField(null=False, default=False)
    objects = SoftDeleteManager()
    objects_with_deleted = SoftDeleteManager(deleted=True)

    class Meta:
        abstract = True

    def delete(self):
        self.is_deleted = True
        invalidate_model(self)
        self.save()

    def restore(self):
        self.is_deleted = False
        invalidate_model(self)
        self.save()


class PolySoftDeleteModel(BaseModel):
    is_deleted = models.BooleanField(null=False, default=False)
    objects = PolySoftDeleteManager()
    objects_with_deleted = PolySoftDeleteManager(deleted=True)

    class Meta:
        abstract = True

    def delete(self):
        self.is_deleted = True
        invalidate_model(self)
        self.save()

    def restore(self):
        self.is_deleted = False
        invalidate_model(self)
        self.save()
