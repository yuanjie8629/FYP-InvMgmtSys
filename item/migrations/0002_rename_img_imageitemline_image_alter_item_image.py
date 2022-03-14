# Generated by Django 4.0.2 on 2022-03-10 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image', '0003_alter_image_image'),
        ('item', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='imageitemline',
            old_name='img',
            new_name='image',
        ),
        migrations.AlterField(
            model_name='item',
            name='image',
            field=models.ManyToManyField(blank=True, related_name='item', through='item.ImageItemLine', to='image.Image'),
        ),
    ]