# Generated by Django 4.0.2 on 2022-04-12 00:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'cart',
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.PositiveIntegerField()),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cart.cart')),
            ],
            options={
                'db_table': 'cart_item',
            },
        ),
    ]
