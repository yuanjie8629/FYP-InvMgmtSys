# Generated by Django 4.0.2 on 2022-03-03 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image', '0002_alter_image_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.URLField(max_length=300),
        ),
    ]