from django.db import models
from core.choices import GENDER_CHOICES
from core.managers import PolySoftDeleteManager, SoftDeleteManager
from cacheops import invalidate_model
from django.contrib.auth.models import AbstractUser


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Users(AbstractUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    username = models.CharField(unique=True, max_length=45)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=1, blank=True, null=True, choices=GENDER_CHOICES
    )
    last_update = models.DateTimeField(auto_now=True)

    first_name = None
    last_name = None

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users"


class SoftDeleteModel(BaseModel):
    is_deleted = models.BooleanField(null=False, default=False)
    objects = SoftDeleteManager()
    objects_with_deleted = SoftDeleteManager(deleted=True)

    class Meta:
        abstract = True

    def delete(self, hard_delete: bool = False):
        if hard_delete:
            super().delete()
        else:
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


