# Generated by Django 2.2.11 on 2020-04-09 03:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_auto_20200409_0842'),
    ]

    operations = [
        migrations.AlterField(
            model_name='donor',
            name='donor_photo',
            field=models.ImageField(blank=True, default='default.jpg', upload_to='donor_photos'),
        ),
    ]