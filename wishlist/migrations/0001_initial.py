# Generated by Django 4.0.2 on 2022-03-14 10:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('item', '0001_initial'),
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('created_at', models.DateTimeField(auto_created=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('cust', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='customer.custacc')),
            ],
            options={
                'db_table': 'wishlist',
            },
        ),
        migrations.CreateModel(
            name='WishlistItem',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item')),
                ('wishlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wishlist.wishlist')),
            ],
            options={
                'db_table': 'wishlist_item',
            },
        ),
        migrations.AddField(
            model_name='wishlist',
            name='item',
            field=models.ManyToManyField(through='wishlist.WishlistItem', to='item.Item'),
        ),
    ]
