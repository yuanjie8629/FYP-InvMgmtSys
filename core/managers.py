from typing import Iterable
from django.db import models, transaction
from cacheops import invalidate_obj
from polymorphic.managers import PolymorphicManager
from polymorphic.query import PolymorphicQuerySet
from postgres_copy import CopyManager,CopyQuerySet

class SoftDeleteQuerySet(CopyQuerySet):
    @transaction.atomic
    def delete(self, hard_delete: bool = False):
        [x.delete(hard_delete) for x in self]


class SoftDeleteManager(CopyManager):
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


class PolySoftDeleteQuerySet(PolymorphicQuerySet, CopyQuerySet):
    @transaction.atomic
    def delete(self, hard_delete: bool = False):
        [x.delete(hard_delete) for x in self]


class PolySoftDeleteManager(PolymorphicManager, CopyManager):
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
