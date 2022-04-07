# Generated by Django 4.0.2 on 2022-04-08 04:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('postcode', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('address', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='cust',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='address',
            name='postcode',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='postcode.postcode'),
        ),
    ]
