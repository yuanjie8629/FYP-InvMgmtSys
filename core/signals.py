from django.dispatch import receiver
from administrator.models import Admin
from core.models import Users
from customer.models import Cust
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=Users)
def check_user(sender, instance, **kwargs):
    if instance.is_superuser and not Admin.objects.filter(pk=instance.pk):
        admin = Admin(users_ptr_id=instance.pk, role="super")
        admin.__dict__.update(instance.__dict__)
        admin.save()
