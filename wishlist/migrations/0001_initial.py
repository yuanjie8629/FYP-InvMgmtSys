# Generated by Django 4.0.2 on 2022-02-27 22:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customer', '0001_initial'),
        ('item', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('wishlist_id', models.IntegerField(primary_key=True, serialize=False)),
                ('created_tms', models.DateTimeField()),
                ('last_update', models.DateTimeField()),
                ('cust', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='customer.custacc')),
            ],
            options={
                'db_table': 'wishlist',
            },
        ),
        migrations.CreateModel(
            name='WishlistItem',
            fields=[
                ('wishlist_item_id', models.IntegerField(primary_key=True, serialize=False)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item')),
                ('wishlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wishlist.wishlist')),
            ],
            options={
                'db_table': 'wishlist_item',
            },
        ),
    ]
