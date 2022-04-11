# Generated by Django 4.0.2 on 2022-04-12 00:07

import cloudinary.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('image', cloudinary.models.CloudinaryField(max_length=255, verbose_name='image')),
            ],
            options={
                'db_table': 'image',
            },
        ),
    ]
