# Generated by Django 4.0.2 on 2022-03-13 06:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='order_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='orderline',
            old_name='order_line_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='ordershipment',
            old_name='order_ship_id',
            new_name='id',
        ),
    ]