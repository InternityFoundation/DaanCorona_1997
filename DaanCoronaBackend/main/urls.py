from django.urls import path
from . import views


urlpatterns = [

    path('mobile/', views.PhoneVerifyView.as_view(), name='PhoneVerifyView'),
    
    path('otp/', views.OTPVerifyView.as_view(), name='OTPVerifyView'),

    path('recipient_profile/', views.RecipientProfileView.as_view(), name='RecipientProfileView'),

    path('recipient_details/', views.RecipientDetailView.as_view(), name='RecipientDetailView'),

    path('send_thanks/', views.SendThanksView.as_view(), name='SendThanksView'),

    path('donor_profile/', views.DonorProfileView.as_view(), name='DonorProfileView'),

    path('donor_details/', views.DonorDetailView.as_view(), name='DonorDetailView'),

    path('nearby_recipients/', views.NearbyRecipientsView.as_view(), name='NearbyRecipientsView'),

    path('pay/', views.PaymentsView.as_view(), name='PaymentsView'),

    path('pay_callback/', views.PaymentsCallbackView.as_view(), name='PaymentsCallbackView'),
]
