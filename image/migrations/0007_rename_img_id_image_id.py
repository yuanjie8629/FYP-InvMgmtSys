# Generated by Django 4.0.2 on 2022-03-13 06:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('image', '0006_alter_image_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='img_id',
            new_name='id',
        ),
    ]
