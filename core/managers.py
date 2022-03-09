from django.db import models, transaction


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
