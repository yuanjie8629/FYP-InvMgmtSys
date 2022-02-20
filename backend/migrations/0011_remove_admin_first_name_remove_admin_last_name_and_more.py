# Generated by Django 4.0.2 on 2022-02-20 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_remove_admin_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='admin',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='admin',
            name='last_name',
        ),
        migrations.AddField(
            model_name='admin',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
