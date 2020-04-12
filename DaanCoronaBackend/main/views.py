from rest_framework.parsers import FileUploadParser
from rest_framework.exceptions import ParseError
from django.shortcuts import render
from rest_framework import views, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from main.models import SMSDevice
from main.utils import get_tokens_for_user, send_email, recipient_is_near_donor
from django.http import QueryDict
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
User=get_user_model()
from main.models import Recipient, Donor, Donation
from django.http import HttpResponse
from decimal import Decimal
import string
import random
import razorpay
client = razorpay.Client(auth=(settings.RAZORPAY_ID, settings.RAZORPAY_SECRET))
client.set_app_details({"title" : "DaanCorona", "version" : "1"})


class PhoneVerifyView(views.APIView):

	def post(self,request,format=None):
		try:
			data = request.POST
			mobile = data.get("mobile")

			try:
				device = SMSDevice.objects.get(number=mobile)
			except ObjectDoesNotExist:
				device = SMSDevice(number = mobile)
				device.save()
			
			if settings.SMS_DEBUG:
				otp = device.sendotp()
				return Response({'otp':otp},status=status.HTTP_201_CREATED)

			flag = device.sendotp()
			if flag:	
				return Response(status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({"exception":e}, status=status.HTTP_400_BAD_REQUEST)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(views.APIView):

	def post(self,request,format=None):
		data = request.POST
		mobile = data.get("mobile")
		token = data.get("token")
		try:
			device = SMSDevice.objects.get(number = mobile)
			newUser = False

			if device.verify_token(token):
				try:
					user = User.objects.get(username=mobile)
				except ObjectDoesNotExist:
					user = User.objects.create_user(mobile)
					user.mobile = mobile
					user.save()
					newUser = True

				token = get_tokens_for_user(user)
				device.delete()

				return Response({"token": token,"newUser":newUser}, status=status.HTTP_201_CREATED)
		except ObjectDoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class RecipientProfileView(views.APIView):

	permission_classes = (IsAuthenticated,)
	parser_class = (FileUploadParser,)

	def get(self, request, format=None):

		user = request.user

		try:
			recipient = Recipient.objects.get(user=user)
		except ObjectDoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		data = {
					"recipient_photo": recipient.recipient_photo.url,
					"business_photo": recipient.business_photo.url,
					"first_name": recipient.user.first_name,
					"last_name": recipient.user.last_name,
					"address": recipient.address,
					"business_name": recipient.business_name,
					"business_type": recipient.business_type,
					"business_address": recipient.business_address,
					"lat": recipient.latitude,
					"long": recipient.longitude,
					"max_credit": recipient.max_credit,
					"upi": recipient.upi,
					"account_no": recipient.account_no,
					"ifsc_code": recipient.ifsc_code
				}

		return Response(data, status=status.HTTP_200_OK)

	def post(self, request, format=None):
		data = request.POST
		files = request.FILES
		user = request.user

		first_name = data.get("first_name")
		last_name = data.get("last_name")
		address = data.get("address")
		business_name = data.get("business_name")
		business_type = data.get("business_type")
		business_address = data.get("business_address")
		latitude = data.get("lat")
		longitude = data.get("long")
		upi = data.get("upi")
		account_no = data.get("account_no")
		ifsc_code = data.get("ifsc_code")
		max_credit = data.get("max_credit")
		recipient_photo = files.get("recipient_photo")
		business_photo = files.get("business_photo")

		if first_name and last_name is not None:
			user.first_name = first_name
			user.last_name = last_name
			user.save()

		try:
			rec = Recipient.objects.get(user=user)
		except ObjectDoesNotExist:
			rec = Recipient(user=user)

		if recipient_photo is not None:
			rec.recipient_photo=recipient_photo
		if business_photo is not None:
			rec.business_photo = business_photo
		if address is not None:
			rec.address=address
		if business_name is not None:
			rec.business_name=business_name
		if business_address is not None:
			rec.business_address=business_address
		if business_type is not None:
			rec.business_type=business_type
		if latitude and longitude is not None:
			rec.latitude=Decimal(latitude)
			rec.longitude=Decimal(longitude)
		if max_credit is not None:
			rec.max_credit=int(max_credit)
		if upi is not None:
			rec.upi=upi
		if account_no and ifsc_code is not None:
			rec.account_no=account_no
			rec.ifsc_code=ifsc_code
			
		rec.save()

		return Response(status=status.HTTP_201_CREATED)


class RecipientDetailView(views.APIView):
	
	permission_classes = (IsAuthenticated,)

	def get(self, request, format=None):

		user = request.user
		recipient = Recipient.objects.get(user=user)

		total_amt = 0
		donation_list = Donation.objects.all().filter(recipient=recipient)
		donors = []
		for donation in donation_list:
			donor = donation.donor
			total_amt += donation.amount
			donors.append({"donor_id":donor.pk,"name":donor.user.get_full_name(), "amount":donation.amount})

		return Response({"name":user.get_full_name(),"max_credit":recipient.max_credit,"total_amt":total_amt,"donors":donors}, status=status.HTTP_200_OK)


class SendThanksView(views.APIView):

	def post(self, request, format=None):
		data = request.POST
		donor_id = data.get("donor_id")

		try:
			donor = Donor.objects.get(pk = donor_id)
		except ObjectDoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		if donor is not None:
			donor_name = donor.user.get_full_name()
			donor_email = donor.email
			message = 'Dear ' + str(donor_name) + ', \nThanks a lot for your kindness. Your Donation means a lot to us. I promise to return back the amount to you in goods'
			email_fun_response = send_email(donor_name, donor_email,message) 

			if email_fun_response:
				return Response(status=status.HTTP_200_OK)
			else:
				return Response(status=status.HTTP_400_BAD_REQUEST)
			
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)


class DonorProfileView(views.APIView):

	permission_classes = (IsAuthenticated,)
	parser_class = (FileUploadParser,)

	def get(self, request, format=None):

		user = request.user

		try:
			donor = Donor.objects.get(user=user)
		except ObjectDoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		data = {
				"donor_id":	donor.pk,
				"donor_photo": donor.donor_photo.url,
				"first_name": user.first_name,
				"last_name": user.last_name,
				"email": user.email
			}

		return Response(data, status=status.HTTP_200_OK)

	def post(self, request, format=None):
		data = request.POST
		files = request.FILES
		user = request.user

		first_name = data.get("first_name")
		last_name = data.get("last_name")
		email = data.get("email")
		donor_photo = files.get("donor_photo")

		
		if first_name and last_name is not None:
			user.first_name = first_name
			user.last_name = last_name
			user.save()
		if email is not None:
			user.email = email
			user.save()

		try:
			donor = Donor.objects.get(user=user)
		except ObjectDoesNotExist:
			donor = Donor(user=user)
		if donor_photo is not None:
			donor.donor_photo = donor_photo
		donor.save()

		return Response(status=status.HTTP_201_CREATED)

class DonorDetailView(views.APIView):
	
	permission_classes = (IsAuthenticated,)

	def get(self, request, format=None):

		user = request.user
		donor = Donor.objects.get(user=user)

		total_amt = 0
		donation_list = Donation.objects.all().filter(donor=donor)
		recipients = []
		for donation in donation_list:
			recipient = donation.recipient
			total_amt += donation.amount
			data = {
					"id":donation.pk,
					"key":donation.key,
					"recipient_photo": recipient.recipient_photo.url,
					"business_photo": recipient.business_photo.url,
					"name": recipient.user.get_full_name(),
					"mobile": recipient.user.mobile,
					"address": recipient.address,
					"business_name": recipient.business_name,
					"business_type": recipient.business_type,
					"business_address": recipient.business_address,
					"amount":donation.amount
				}
			recipients.append(data)

		return Response({"name":user.get_full_name(),"total_amt":total_amt,"recipients":recipients}, status=status.HTTP_200_OK)


class NearbyRecipientsView(views.APIView):

	permission_classes = (IsAuthenticated,)

	def post(self,request,format=None):
		
		data = request.POST
		
		donor_lat = Decimal(data.get("lat"))
		donor_lon = Decimal(data.get("long"))

		recipients = Recipient.objects.all()
		nearby_recipients = []

		for recipient in recipients:

			recipient_lat = recipient.latitude
			recipient_lon = recipient.longitude

			if recipient_is_near_donor(donor_lat, donor_lon, recipient_lat, recipient_lon):
				data = {
						"recipient_id": recipient.pk,
						"recipient_photo": recipient.recipient_photo.url,
						"business_photo": recipient.business_photo.url,
						"name": recipient.user.get_full_name(),
						"mobile":recipient.user.mobile,
						"address": recipient.address,
						"business_name": recipient.business_name,
						"business_type": recipient.business_type,
						"business_address": recipient.business_address,
						"lat": recipient.latitude,
						"long": recipient.longitude,
						"max_creditable_amount": recipient.max_credit - recipient.credit_till_now,
					}
			
				nearby_recipients.append(data)

		return Response({"nearby_recipients" : nearby_recipients}, status=status.HTTP_200_OK)
		

class PaymentsView(views.APIView):

	permission_classes = (IsAuthenticated,)

	def post(self, request, format=None):
		data = request.POST
		user = request.user

		context = {
			"amount": data.get("amount"),
			"currency":'INR',
			"receipt":''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))+'#'+str(data.get("recipient_id")),
			"notes":{'recipient_id': data.get("recipient_id")},
			"payment_capture":'0',
			}

		resp = client.order.create(data=context)

		return Response({"amount": data.get("amount"),"order_id":resp['id'],"name":user.get_full_name(),"mobile":user.mobile,"email":user.email}, status=status.HTTP_200_OK)


class PaymentsCallbackView(views.APIView):

	permission_classes = (IsAuthenticated,)

	def post(self, request, format=None):
		data = request.POST

		params_dict = {
			"razorpay_order_id": data.get("razorpay_order_id"),
			"razorpay_payment_id": data.get("razorpay_payment_id"),
			"razorpay_signature": data.get("razorpay_signature")
		}

		try:
			client.utility.verify_payment_signature(params_dict)
		except Exception:
			return Response(status = status.HTTP_400_BAD_REQUEST)

		details = client.order.fetch(data.get("razorpay_order_id"))

		donation = Donation()
		donation.donor = Donor.objects.get(user=request.user)
		donation.recipient = Recipient.objects.get(pk=details['notes']['recipient_id'])
		donation.amount = details['amount']
		donation.razorpay_order_id = data.get("razorpay_order_id")
		donation.razorpay_payment_id = data.get("razorpay_payment_id")
		donation.razorpay_signature = data.get("razorpay_signature")
		donation.key = details['receipt'].split("#")[0]
		donation.save()

		message = 'Payment accepted. Unique ID - ' + str(donation.key)
		send_email(user.get_full_name(),user.email,message)
		return Response({"key":donation.key},status=status.HTTP_200_OK)




