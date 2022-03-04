# Generated by Django 4.0.2 on 2022-02-27 22:01

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
                ('voucher_id', models.IntegerField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=20)),
                ('status', models.CharField(max_length=20)),
                ('type', models.CharField(max_length=20)),
                ('discount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('min_spend', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('max_discount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('total_amt', models.IntegerField()),
                ('usage_limit', models.IntegerField()),
                ('avail_start_tm', models.DateTimeField()),
                ('avail_end_tm', models.DateTimeField(blank=True, null=True)),
                ('last_update', models.DateTimeField()),
            ],
            options={
                'db_table': 'voucher',
            },
        ),
        migrations.CreateModel(
            name='VoucherLine',
            fields=[
                ('voucher_line_id', models.IntegerField(primary_key=True, serialize=False)),
                ('cust_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='customer.custtype')),
                ('voucher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='voucher.voucher')),
            ],
            options={
                'db_table': 'voucher_line',
            },
        ),
    ]