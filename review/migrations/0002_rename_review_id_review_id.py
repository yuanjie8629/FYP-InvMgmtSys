# Generated by Django 4.0.2 on 2022-03-13 06:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='review',
            old_name='review_id',
            new_name='id',
        ),
    ]
