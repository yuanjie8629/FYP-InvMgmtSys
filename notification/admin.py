from django.contrib import admin
from core.admin import SoftDeleteAdmin

from notification.models import Notification

# Register your models here.
admin.site.register(Notification, SoftDeleteAdmin)