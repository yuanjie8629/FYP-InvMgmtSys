# Generated by Django 4.0.2 on 2022-04-08 04:36

from django.db import migrations, models
import django.db.models.deletion
import order.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('item', '0001_initial'),
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('id', models.CharField(default=order.models.create_unique_id, max_length=40, primary_key=True, serialize=False)),
                ('total_amt', models.DecimalField(blank=True, decimal_places=2, max_digits=10)),
                ('status', models.CharField(blank=True, choices=[('completed', 'Completed'), ('cancel', 'Cancellation'), ('unpaid', 'Unpaid'), ('toShip', 'To Ship'), ('toPick', 'To Pickup'), ('shipping', 'Shipping')], max_length=20)),
                ('email', models.CharField(blank=True, max_length=255, null=True)),
                ('cust', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='order', to='customer.cust')),
            ],
            options={
                'db_table': 'order',
            },
        ),
        migrations.CreateModel(
            name='OrderLine',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('special_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('cost_per_unit', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('weight', models.DecimalField(decimal_places=2, max_digits=8)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_line', to='item.item')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_line', to='order.order')),
            ],
            options={
                'db_table': 'order_line',
            },
        ),
        migrations.AddField(
            model_name='order',
            name='item',
            field=models.ManyToManyField(through='order.OrderLine', to='item.Item'),
        ),
    ]
