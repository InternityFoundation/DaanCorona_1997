# Generated by Django 2.2.11 on 2020-04-08 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_auto_20200403_1256'),
    ]

    operations = [
        migrations.AddField(
            model_name='donation',
            name='key',
            field=models.CharField(default='AAAAAA', max_length=6),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='donation',
            name='razorpay_order_id',
            field=models.CharField(default='1', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='donation',
            name='razorpay_payment_id',
            field=models.CharField(default='1', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='donation',
            name='razorpay_signature',
            field=models.CharField(default='1', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='recipient',
            name='account_no',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='recipient',
            name='ifsc_code',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='recipient',
            name='upi',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
