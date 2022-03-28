# Generated by Django 4.0.2 on 2022-03-28 22:01

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        ('postcode', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustType',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'cust_type',
            },
        ),
        migrations.CreateModel(
            name='CustPosReg',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('marital_status', models.CharField(choices=[('single', 'Single'), ('married', 'Married'), ('seperated', 'Seperated'), ('divorced', 'Divorced')], max_length=20)),
                ('email', models.CharField(max_length=255)),
                ('phone_num', models.CharField(max_length=15)),
                ('gender', models.CharField(choices=[('m', 'Male'), ('f', 'Female')], max_length=1)),
                ('birthdate', models.DateField()),
                ('address', models.CharField(max_length=255)),
                ('occupation', models.CharField(max_length=45)),
                ('comp_name', models.CharField(blank=True, max_length=100, null=True)),
                ('accept', models.BooleanField(blank=True, null=True)),
                ('position', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='customer.custtype')),
                ('postcode', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='postcode.postcode')),
            ],
            options={
                'db_table': 'cust_pos_reg',
            },
        ),
        migrations.CreateModel(
            name='Cust',
            fields=[
                ('users_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('cust_type', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='cust', to='customer.custtype')),
                ('pos_reg', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='customer.custposreg')),
            ],
            options={
                'db_table': 'cust',
            },
            bases=('core.users',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
