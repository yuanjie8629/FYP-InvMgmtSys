# Generated by Django 4.0.2 on 2022-04-05 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='read',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]