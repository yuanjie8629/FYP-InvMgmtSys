# Generated by Django 4.0.2 on 2022-03-24 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shipment', '0006_alter_shippingfee_sub_fee'),
    ]

    operations = [
        migrations.AddField(
            model_name='shippingfee',
            name='sub_weight',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
