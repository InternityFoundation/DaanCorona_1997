from math import radians, cos, sin, asin, sqrt
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import smtplib
from django.shortcuts import get_object_or_404

#SNS Connection
import boto3
if not settings.SMS_DEBUG:
    snsclient = boto3.client('sns')
    snsclient.set_sms_attributes(attributes={'DefaultSMSType':'Transactional'})


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def send_email(name, email,message):

    mail = smtplib.SMTP('smtp.gmail.com', settings.EMAIL_PORT)
    mail.ehlo()
    mail.starttls()

    mail_failure_message = 'Mail to' + \
        str(name) + ' at ' + str(email) + ' failed !!! \n\n\n\n\n"""' + message +'"""'

    mail.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)

    sent = False
    try:
        mail.sendmail(settings.EMAIL_HOST_USER, email, message)
        sent = True
    except:
        mail.sendmail(settings.EMAIL_HOST_USER,
                      settings.EMAIL_HOST_USER, mail_failure_message)

    mail.close()
    return sent

    


def send_otp_util(number,otp):
    if not settings.SMS_DEBUG:
        response=snsclient.publish(PhoneNumber=number,Message='Your otp for DaanCorona is '+otp)
        if(response['ResponseMetadata']['HTTPStatusCode']==200):
            return True
    return False


def add_credit_to_recipient(recipient_id, credit):
    from .models import Recipient
    recipient = get_object_or_404(Recipient, pk = recipient_id)
    
    if recipient.credit_till_now + credit > recipient.max_credit :
        recipient.save()
        return 0       # Cannot Add Credit to Recipient
    else:
        recipient.credit_till_now += credit
        recipient.save()
        return 1       # Successfully Added Credit to Recipient

    
def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # the haversine formula
    lat_diff = lat2 - lat1
    lon_diff = lon2 - lon1

    a = sin(lat_diff/2)**2 + cos(lat1) * cos(lat2) * sin(lon_diff/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of Earth in Kilometers
    return c * r


def recipient_is_near_donor(donor_lat, donor_lon, recipient_lat, recipient_lon):

    donor_lat, donor_lon, recipient_lat, recipient_lon = map(radians, [donor_lat, donor_lon, recipient_lat, recipient_lon])

    SEARCH_RADIUS = 1.0000  #Search Radius in Kilometers
    
    distance = haversine(donor_lat, donor_lon, recipient_lat, recipient_lon)

    if distance <= SEARCH_RADIUS:
        return 1    # Recipient is Near
    else:
        return 0    # Recipient is NOT Near

