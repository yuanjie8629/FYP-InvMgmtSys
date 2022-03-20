# Generated by Django 4.0.2 on 2022-03-21 04:49

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Voucher',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=20, unique=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('oos', 'Out of Stock'), ('hidden', 'Hidden'), ('scheduled', 'Scheduled'), ('expired', 'Expired')], max_length=20)),
                ('type', models.CharField(max_length=20)),
                ('discount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('min_spend', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('max_discount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('total_amt', models.IntegerField()),
                ('usage_limit', models.IntegerField()),
                ('auto_apply', models.BooleanField(default=False)),
                ('avail_start_dt', models.DateField()),
                ('avail_end_dt', models.DateField(blank=True, default=datetime.date(9999, 12, 31), null=True)),
            ],
            options={
                'db_table': 'voucher',
            },
        ),
        migrations.CreateModel(
            name='VoucherLine',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('cust_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='voucher_line', to='customer.custtype')),
                ('voucher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='voucher_line', to='voucher.voucher')),
            ],
            options={
                'db_table': 'voucher_line',
            },
        ),
        migrations.AddField(
            model_name='voucher',
            name='cust_type',
            field=models.ManyToManyField(through='voucher.VoucherLine', to='customer.CustType'),
        ),
    ]
