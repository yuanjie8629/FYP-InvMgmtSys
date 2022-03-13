# Generated by Django 4.0.2 on 2022-03-12 09:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('item', '0004_remove_item_image_delete_imageitemline'),
        ('image', '0003_alter_image_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageItemLine',
            fields=[
                ('img_line_id', models.AutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'image_item_line',
            },
        ),
        migrations.AddField(
            model_name='image',
            name='item',
            field=models.ManyToManyField(blank=True, related_name='image', through='image.ImageItemLine', to='item.Item'),
        ),
        migrations.AddField(
            model_name='imageitemline',
            name='image',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='image.image'),
        ),
        migrations.AddField(
            model_name='imageitemline',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item'),
        ),
    ]
