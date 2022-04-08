from django.dispatch import receiver
from administrator.models import Admin
from core.models import Users
from django.db.models.signals import post_save
from axes.signals import user_locked_out
from rest_framework.exceptions import PermissionDenied

@receiver(post_save, sender=Users)
def check_user(sender, instance, **kwargs):
    if instance.is_superuser and not Admin.objects.filter(pk=instance.pk):
        admin = Admin(users_ptr_id=instance.pk, role="super")
        admin.__dict__.update(instance.__dict__)
        admin.save()

@receiver(user_locked_out)
def raise_permission_denied(*args, **kwargs):
    raise PermissionDenied("Too many failed login attempts")