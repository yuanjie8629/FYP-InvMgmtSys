# Generated by Django 4.0.2 on 2022-03-28 22:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('code', models.CharField(max_length=3, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=45)),
            ],
            options={
                'db_table': 'state',
            },
        ),
        migrations.CreateModel(
            name='Postcode',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('postcode', models.CharField(max_length=5)),
                ('city', models.CharField(max_length=50)),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='postcode.state')),
            ],
            options={
                'db_table': 'postcode',
            },
        ),
    ]
