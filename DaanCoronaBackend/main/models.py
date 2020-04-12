from __future__ import absolute_import, division, print_function, unicode_literals

from binascii import unhexlify
import logging
import time
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ImproperlyConfigured
from django.db import models
from django.utils.encoding import force_text
from django.conf import settings
from django_otp.models import Device
from django_otp.oath import TOTP
from django_otp.util import hex_validator, random_hex
import requests
from django.utils import timezone
from PIL import Image, ImageFile
from main.utils import send_otp_util


class CustomUser(AbstractUser):
    mobile = models.CharField(max_length=15)

    def __str__(self):
        return self.username


class Donor(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='donor')
    donor_photo = models.ImageField(default="default.jpg", upload_to='donor_photos', blank=True)

    def __str__(self):
        return self.user.get_full_name()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        donor_img = Image.open(self.donor_photo.path)

        if donor_img.height > 400 or donor_img.width > 400:
            output_size = (400, 400)
            donor_img.thumbnail(output_size)
            donor_img.save(self.donor_photo.path)

class Recipient(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='recipient')
    recipient_photo = models.ImageField(default="default.jpg", upload_to='recipient_photos', blank=True)
    business_photo = models.ImageField(default="default.jpg", upload_to='business_photos', blank=True)
    address = models.TextField(max_length=1000, blank=True)
    business_name = models.CharField(verbose_name = "Business Name", max_length=255, blank=True)
    business_type = models.CharField(verbose_name="Business Type", max_length=255, blank=True)
    business_address = models.TextField(verbose_name="Business Address", max_length=1000, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    max_credit = models.IntegerField(default=0)
    credit_till_now = models.IntegerField(default=0)
    upi = models.CharField(max_length=50, blank=True)
    account_no = models.CharField(max_length=30, blank=True)
    ifsc_code = models.CharField(max_length=30, blank=True, )
    
    def __str__(self):
        return self.user.get_full_name()
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        recipient_img = Image.open(self.recipient_photo.path)
        business_img = Image.open(self.business_photo.path)


        if recipient_img.height > 400 or recipient_img.width > 400:
            output_size = (400, 400)
            recipient_img.thumbnail(output_size)
            recipient_img.save(self.recipient_photo.path)

        if business_img.height > 400 or business_img.width > 400:
            output_size = (400, 400)
            business_img.thumbnail(output_size)
            business_img.save(self.business_photo.path)



class Donation(models.Model):
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE)
    recipient = models.ForeignKey(Recipient, on_delete=models.CASCADE, related_name = 'recipient')
    amount = models.IntegerField(default=0)
    razorpay_order_id = models.CharField(max_length=100)
    razorpay_payment_id = models.CharField(max_length=100)
    razorpay_signature = models.CharField(max_length=255)
    key = models.CharField(max_length=6)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '' + str(self.donor.user.get_full_name()) + '-' + str(self.recipient.user.get_full_name())

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


#Following section deals with OTP Verification No changes required
logger = logging.getLogger(__name__)


def default_key():
    return force_text(random_hex(20))


def key_validator(value):
    return hex_validator(20)(value)


class SMSDevice(Device):

    number = models.CharField(
        max_length=15,
        help_text="The mobile number to deliver tokens to (E.164)."
    )

    key = models.CharField(
        max_length=40,
        validators=[key_validator],
        default=default_key,
        help_text="A random key used to generate tokens (hex-encoded)."
    )

    last_t = models.BigIntegerField(
        default=-1,
        help_text="The t value of the latest verified token. The next token must be at a higher time step."
    )

    user = models.ForeignKey(CustomUser,null=True, on_delete=models.CASCADE)

    class Meta(Device.Meta):
        verbose_name = "Twilio SMS Device"

    @property
    def bin_key(self):
        return unhexlify(self.key.encode())

    def sendotp(self):
        totp = self.totp_obj()
        token = format(totp.token(), '06d')

        if settings.SMS_DEBUG:
            return token

        return send_otp_util(self.number,token)

    def verify_token(self, token):
        try:
            token = int(token)
        except Exception:
            verified = False
        else:
            totp = self.totp_obj()
            tolerance = 60

            for offset in range(-tolerance, 1):
                totp.drift = offset
                if (totp.t() > self.last_t) and (totp.token() == token):
                    self.last_t = totp.t()
                    self.save()

                    verified = True
                    break
            else:
                verified = False

        return verified

    def totp_obj(self):
        totp = TOTP(self.bin_key, step=1)
        totp.time = time.time()

        return totp
