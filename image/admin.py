from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from image.models import Image

# Register your models here.
admin.site.register(Image, SimpleHistoryAdmin)
