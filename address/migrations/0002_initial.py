# Generated by Django 4.0.2 on 2022-03-16 15:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('address', '0001_initial'),
        ('postcode', '0001_initial'),
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='shippingaddress',
            name='cust',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='customer.custacc'),
        ),
        migrations.AddField(
            model_name='shippingaddress',
            name='postal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='postcode.postcode'),
        ),
    ]
