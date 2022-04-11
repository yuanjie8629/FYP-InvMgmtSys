# Generated by Django 4.0.2 on 2022-04-12 05:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('item', '0001_initial'),
        ('cart', '0001_initial'),
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitem',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item'),
        ),
        migrations.AddField(
            model_name='cart',
            name='cust',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='customer.cust'),
        ),
        migrations.AddField(
            model_name='cart',
            name='items',
            field=models.ManyToManyField(through='cart.CartItem', to='item.Item'),
        ),
    ]
