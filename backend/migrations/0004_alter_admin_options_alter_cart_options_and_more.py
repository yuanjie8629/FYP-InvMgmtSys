# Generated by Django 4.0.2 on 2022-02-20 11:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_admin_cart_cartitem_city_courier_custacc_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='admin',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='cart',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='cartitem',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='city',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='courier',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='custacc',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='custposdeclar',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='custposdeclarques',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='custposreg',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='custprofile',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='custtype',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='image',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='imageline',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='item',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='order',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='orderline',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='ordershipment',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='package',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='packageitem',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='payment',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='pickup',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='pickuploc',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='postcode',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='product',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='review',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='shipment',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='shippingaddress',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='shippingfee',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='state',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='voucher',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='voucherline',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='wishlist',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='wishlistitem',
            options={'managed': False},
        ),
    ]
