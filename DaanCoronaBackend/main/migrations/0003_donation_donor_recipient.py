# Generated by Django 2.2.11 on 2020-03-30 07:06

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20200329_1738'),
    ]

    operations = [
        migrations.CreateModel(
            name='Recipient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipient_photo', models.ImageField(default='default.jpg', upload_to='recipient_photos')),
                ('business_photo', models.ImageField(default='default.jpg', upload_to='business_photos')),
                ('address', models.TextField(max_length=1000)),
                ('business_name', models.CharField(max_length=255, verbose_name='Business Name')),
                ('business_type', models.CharField(max_length=255, verbose_name='Business Type')),
                ('business_address', models.TextField(max_length=1000, verbose_name='Business Address')),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipient', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Donor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='donor', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0)),
                ('transaction_date_and_time', models.DateTimeField(default=datetime.datetime(2020, 3, 30, 7, 6, 21, 290258, tzinfo=utc))),
                ('donor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Donor')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipient', to='main.Recipient')),
            ],
        ),
    ]
