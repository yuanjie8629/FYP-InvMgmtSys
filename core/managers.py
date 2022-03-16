from typing import Iterable
from django.db import models, transaction
from cacheops import invalidate_obj
from polymorphic.managers import PolymorphicManager
from polymorphic.query import PolymorphicQuerySet


class SoftDeleteQuerySet(models.QuerySet):
    @transaction.atomic
    def delete(self):
        [x.delete() for x in self]


class SoftDeleteManager(models.Manager):
    def __init__(self, *args, **kwargs):
        self.with_deleted = kwargs.pop("deleted", False)
        super(SoftDeleteManager, self).__init__(*args, **kwargs)

    def get_queryset(self):
        qs = SoftDeleteQuerySet(self.model)

        if self.with_deleted:
            return qs
        return qs.filter(is_deleted=False)

    def bulk_update(self, objs, *args, **kwags) -> int:
        for obj in objs:
            invalidate_obj(obj)
        return super().bulk_update(objs, *args, **kwags)


class PolySoftDeleteQuerySet(PolymorphicQuerySet):
    @transaction.atomic
    def delete(self):
        [x.delete() for x in self]


class PolySoftDeleteManager(PolymorphicManager):
    def __init__(self, *args, **kwargs):
        self.with_deleted = kwargs.pop("deleted", False)
        super(PolySoftDeleteManager, self).__init__(*args, **kwargs)

    def get_queryset(self):
        qs = PolySoftDeleteQuerySet(self.model)

        if self.with_deleted:
            return qs
        return qs.filter(is_deleted=False)

    def bulk_update(self, objs, *args, **kwags) -> int:
        for obj in objs:
            invalidate_obj(obj)
        return super().bulk_update(objs, *args, **kwags)
