from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import smtplib

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


def send_thanks_email_to_donor(donor_name, donor_email):

    mail = smtplib.SMTP('smtp.gmail.com', settings.EMAIL_PORT)
    mail.ehlo()
    mail.starttls()

    thank_you_message = 'Dear ' + \
        str(donor_name) + ', \nThanks a lot for your kindness. Your Donation means a lot to us. I promise to return back the amount to you in goods'
    mail_failure_message = 'Mail to' + \
        str(donor_name) + ' at ' + str(donor_email) + ' failed !!!'

    mail.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)

    try:
        mail.sendmail(settings.EMAIL_HOST_USER, donor_email, thank_you_message)
        return 1
    except:
        print('Mail to' + str(donor_name) + ' at ' +
              str(donor_email) + ' failed !!!')
        mail.sendmail(settings.EMAIL_HOST_USER,
                      settings.EMAIL_HOST_USER, mail_failure_message)
        return 0

    print('Mail Sent to donor' + str(donor_name) + ' at ' + str(donor_email))
    mail.close()


def send_otp_util(number,otp):
    if not settings.SMS_DEBUG:
        response=snsclient.publish(PhoneNumber=number,Message='Your otp for DaanCorona is '+otp)
        if(response['ResponseMetadata']['HTTPStatusCode']==200):
            return True
    return False
