# Generated by Django 4.0.2 on 2022-03-02 12:39

import auto_prefetch
from django.db import migrations
import django.db.models.deletion
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('item', '0004_rename_pack_package_item_rename_product_product_item'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='product',
            managers=[
                ('objects', django.db.models.manager.Manager()),
                ('prefetch_manager', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AlterField(
            model_name='product',
            name='item',
            field=auto_prefetch.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='item', serialize=False, to='item.item'),
        ),
    ]