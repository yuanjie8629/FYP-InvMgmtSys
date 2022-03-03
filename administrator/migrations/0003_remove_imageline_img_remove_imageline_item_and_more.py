# Generated by Django 4.0.2 on 2022-02-27 21:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('item', '0001_initial'),
        ('administrator', '0002_alter_admin_gender'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imageline',
            name='img',
        ),
        migrations.RemoveField(
            model_name='imageline',
            name='item',
        ),
        migrations.RemoveField(
            model_name='package',
            name='pack',
        ),
        migrations.RemoveField(
            model_name='packageitem',
            name='pack',
        ),
        migrations.RemoveField(
            model_name='packageitem',
            name='prod',
        ),
        migrations.RemoveField(
            model_name='product',
            name='product',
        ),
        migrations.AlterField(
            model_name='cartitem',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item'),
        ),
        migrations.AlterField(
            model_name='orderline',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item'),
        ),
        migrations.AlterField(
            model_name='review',
            name='item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='item.item'),
        ),
        migrations.AlterField(
            model_name='wishlistitem',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.item'),
        ),
        migrations.DeleteModel(
            name='Image',
        ),
        migrations.DeleteModel(
            name='ImageLine',
        ),
        migrations.DeleteModel(
            name='Item',
        ),
        migrations.DeleteModel(
            name='Package',
        ),
        migrations.DeleteModel(
            name='PackageItem',
        ),
        migrations.DeleteModel(
            name='Product',
        ),
    ]
