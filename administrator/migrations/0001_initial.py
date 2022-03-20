# Generated by Django 4.0.2 on 2022-03-21 04:49

import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('users_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.users')),
                ('role', models.CharField(blank=True, choices=[('super', 'Super Admin'), ('admin', 'Admin'), ('service', 'Service Admin')], max_length=20, null=True)),
                ('phone_num', models.CharField(max_length=15)),
            ],
            options={
                'db_table': 'admin',
            },
            bases=('core.users',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
