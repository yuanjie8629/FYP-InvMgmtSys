# Generated by Django 4.0.2 on 2022-02-20 11:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_user_delete_todo'),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('admin_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('username', models.CharField(max_length=45, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('phone_num', models.CharField(max_length=15)),
                ('birthdate', models.DateField(blank=True, null=True)),
                ('gender', models.CharField(blank=True, max_length=1, null=True)),
                ('role', models.CharField(max_length=30)),
            ],
            options={
                'db_table': 'admin',
            },
        ),
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('cart_id', models.IntegerField(primary_key=True, serialize=False)),
                ('created_tms', models.DateTimeField()),
                ('last_update', models.DateTimeField()),
            ],
            options={
                'db_table': 'cart',
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('cart_item_id', models.IntegerField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.cart')),
            ],
            options={
                'db_table': 'cart_item',
            },
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('city_id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=45)),
            ],
            options={
                'db_table': 'city',
            },
        ),
        migrations.CreateModel(
            name='Courier',
            fields=[
                ('courier_id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'courier',
            },
        ),
        migrations.CreateModel(
            name='CustAcc',
            fields=[
                ('cust_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=45, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('status', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'cust_acc',
            },
        ),
        migrations.CreateModel(
            name='CustPosDeclar',
            fields=[
                ('pos_decl_id', models.IntegerField(primary_key=True, serialize=False)),
                ('answer', models.CharField(max_length=300)),
            ],
            options={
                'db_table': 'cust_pos_declar',
            },
        ),
        migrations.CreateModel(
            name='CustPosDeclarQues',
            fields=[
                ('pos_declar_ques_id', models.IntegerField(primary_key=True, serialize=False)),
                ('ques', models.CharField(max_length=300)),
            ],
            options={
                'db_table': 'cust_pos_declar_ques',
            },
        ),
        migrations.CreateModel(
            name='CustPosReg',
            fields=[
                ('pos_reg_id', models.AutoField(primary_key=True, serialize=False)),
                ('ic_num', models.CharField(max_length=15)),
                ('name', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=255)),
                ('phone_num', models.CharField(max_length=15)),
                ('gender', models.CharField(max_length=1)),
                ('birthdate', models.DateField()),
                ('address', models.CharField(max_length=255)),
                ('position', models.CharField(max_length=30)),
                ('marital_status', models.CharField(max_length=20)),
                ('occupation', models.CharField(blank=True, max_length=45, null=True)),
                ('comp_name', models.CharField(blank=True, max_length=100, null=True)),
                ('reg_dt', models.DateTimeField()),
                ('accept', models.IntegerField()),
                ('accepted_by', models.ForeignKey(db_column='accepted_by', on_delete=django.db.models.deletion.DO_NOTHING, to='backend.admin')),
            ],
            options={
                'db_table': 'cust_pos_reg',
            },
        ),
        migrations.CreateModel(
            name='CustType',
            fields=[
                ('cust_type_id', models.IntegerField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'cust_type',
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('img_id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('url', models.CharField(max_length=300)),
            ],
            options={
                'db_table': 'image',
            },
        ),
        migrations.CreateModel(
            name='ImageLine',
            fields=[
                ('img_line_id', models.IntegerField(primary_key=True, serialize=False)),
                ('img', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.image')),
            ],
            options={
                'db_table': 'image_line',
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('item_id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(max_length=20)),
                ('description', models.TextField()),
                ('status', models.CharField(max_length=20)),
                ('thumbnail', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('special_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('sku', models.CharField(max_length=45)),
                ('stock', models.IntegerField()),
                ('weight', models.DecimalField(decimal_places=2, max_digits=8)),
                ('length', models.DecimalField(decimal_places=2, max_digits=8)),
                ('width', models.DecimalField(decimal_places=2, max_digits=8)),
                ('height', models.DecimalField(decimal_places=2, max_digits=8)),
                ('last_update', models.DateTimeField()),
            ],
            options={
                'db_table': 'item',
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('order_id', models.IntegerField(primary_key=True, serialize=False)),
                ('created_tms', models.DateTimeField()),
                ('total_amt', models.DecimalField(decimal_places=2, max_digits=10)),
                ('ship_type', models.CharField(max_length=20)),
                ('status', models.CharField(max_length=20)),
                ('cust', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custacc')),
            ],
            options={
                'db_table': 'order',
            },
        ),
        migrations.CreateModel(
            name='OrderLine',
            fields=[
                ('order_line_id', models.IntegerField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('special_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('weight', models.DecimalField(decimal_places=2, max_digits=8)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.item')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.order')),
            ],
            options={
                'db_table': 'order_line',
            },
        ),
        migrations.CreateModel(
            name='OrderShipment',
            fields=[
                ('order_ship_id', models.IntegerField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=20)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.order')),
            ],
            options={
                'db_table': 'order_shipment',
            },
        ),
        migrations.CreateModel(
            name='PackageItem',
            fields=[
                ('pack_item_id', models.IntegerField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'package_item',
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('payment_id', models.IntegerField(primary_key=True, serialize=False)),
                ('method', models.CharField(max_length=20)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('paid', models.IntegerField()),
                ('reference_num', models.CharField(max_length=50)),
                ('created_tms', models.DateTimeField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.order')),
            ],
            options={
                'db_table': 'payment',
            },
        ),
        migrations.CreateModel(
            name='PickupLoc',
            fields=[
                ('pickup_loc_id', models.IntegerField(primary_key=True, serialize=False)),
                ('location', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'pickup_loc',
            },
        ),
        migrations.CreateModel(
            name='Postcode',
            fields=[
                ('postal_id', models.IntegerField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=5)),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.city')),
            ],
            options={
                'db_table': 'postcode',
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('review_id', models.IntegerField(primary_key=True, serialize=False)),
                ('rating', models.IntegerField(blank=True, null=True)),
                ('comment', models.TextField(blank=True, null=True)),
                ('created_tms', models.DateTimeField(blank=True, null=True)),
                ('cust', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custacc')),
                ('item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='backend.item')),
            ],
            options={
                'db_table': 'review',
            },
        ),
        migrations.CreateModel(
            name='ShippingAddress',
            fields=[
                ('address_id', models.IntegerField(primary_key=True, serialize=False)),
                ('address', models.CharField(max_length=200)),
                ('contact_name', models.CharField(max_length=100)),
                ('contact_num', models.CharField(max_length=15)),
                ('default', models.IntegerField(blank=True, null=True)),
                ('cust', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custacc')),
                ('postal', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.postcode')),
            ],
            options={
                'db_table': 'shipping_address',
            },
        ),
        migrations.CreateModel(
            name='ShippingFee',
            fields=[
                ('ship_fee_id', models.IntegerField(primary_key=True, serialize=False)),
                ('location', models.CharField(max_length=45)),
                ('weight_start', models.DecimalField(decimal_places=2, max_digits=8)),
                ('weight_end', models.DecimalField(decimal_places=2, max_digits=8)),
                ('ship_fee', models.DecimalField(decimal_places=2, max_digits=10)),
                ('courier', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.courier')),
            ],
            options={
                'db_table': 'shipping_fee',
            },
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('state_id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=45)),
            ],
            options={
                'db_table': 'state',
            },
        ),
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
                ('cust_type', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custtype')),
                ('voucher', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.voucher')),
            ],
            options={
                'db_table': 'voucher_line',
            },
        ),
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('wishlist_id', models.IntegerField(primary_key=True, serialize=False)),
                ('created_tms', models.DateTimeField()),
                ('last_update', models.DateTimeField()),
                ('cust', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custacc')),
            ],
            options={
                'db_table': 'wishlist',
            },
        ),
        migrations.CreateModel(
            name='WishlistItem',
            fields=[
                ('wishlist_item_id', models.IntegerField(primary_key=True, serialize=False)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.item')),
                ('wishlist', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.wishlist')),
            ],
            options={
                'db_table': 'wishlist_item',
            },
        ),
        migrations.CreateModel(
            name='CustProfile',
            fields=[
                ('cust', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='backend.custacc')),
                ('name', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=255)),
                ('phone_num', models.CharField(max_length=15)),
                ('gender', models.CharField(blank=True, max_length=1, null=True)),
                ('birthdate', models.DateField(blank=True, null=True)),
            ],
            options={
                'db_table': 'cust_profile',
            },
        ),
        migrations.CreateModel(
            name='Package',
            fields=[
                ('pack', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='backend.item')),
                ('avail_start_tm', models.DateTimeField()),
                ('avail_end_tm', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'package',
            },
        ),
        migrations.CreateModel(
            name='Pickup',
            fields=[
                ('pickup', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='backend.ordershipment')),
                ('pickup_dt', models.DateTimeField()),
                ('pickup_loc', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.pickuploc')),
            ],
            options={
                'db_table': 'pickup',
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('product', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='backend.item')),
                ('category', models.CharField(max_length=30)),
                ('cost_per_unit', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('ordering_cost', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('holding_cost', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('avg_lead_tm', models.IntegerField(blank=True, null=True)),
                ('max_lead_tm', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'product',
            },
        ),
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('ship', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='backend.ordershipment')),
                ('created_tms', models.DateTimeField()),
                ('track_num', models.CharField(max_length=50)),
                ('address', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.shippingaddress')),
                ('ship_fee', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.shippingfee')),
            ],
            options={
                'db_table': 'shipment',
            },
        ),
        migrations.DeleteModel(
            name='User',
        ),
        migrations.AddField(
            model_name='order',
            name='voucher',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='backend.voucher'),
        ),
        migrations.AddField(
            model_name='imageline',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.item'),
        ),
        migrations.AddField(
            model_name='custposreg',
            name='postal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.postcode'),
        ),
        migrations.AddField(
            model_name='custposdeclar',
            name='pos_declar_ques',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custposdeclarques'),
        ),
        migrations.AddField(
            model_name='custposdeclar',
            name='pos_reg',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custposreg'),
        ),
        migrations.AddField(
            model_name='custacc',
            name='cust_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custtype'),
        ),
        migrations.AddField(
            model_name='custacc',
            name='pos_reg',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custposreg'),
        ),
        migrations.AddField(
            model_name='city',
            name='state',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.state'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.item'),
        ),
        migrations.AddField(
            model_name='cart',
            name='cust',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.custacc'),
        ),
        migrations.AddField(
            model_name='packageitem',
            name='pack',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.package'),
        ),
        migrations.AddField(
            model_name='packageitem',
            name='prod',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='backend.product'),
        ),
    ]
