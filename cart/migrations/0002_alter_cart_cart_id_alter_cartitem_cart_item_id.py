# Generated by Django 4.0.2 on 2022-03-10 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='cart_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='cartitem',
            name='cart_item_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
