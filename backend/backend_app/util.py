import pyotp
import qrcode
import os
from django.conf import settings

from rest_framework_simplejwt.tokens import RefreshToken
 
def generate_jwt(user):
    # Generate refresh and access tokens for the user
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

def encrypt_file(file_data, key):
    """
    Encrypts the file data using XOR encryption with the provided key.
    """
    encrypted = b''.join([bytes([byte ^ ord(key[i % len(key)])]) for i, byte in enumerate(file_data)])
    return encrypted

def decrypt_file(encrypted_data, key):
    """
    Decrypts the encrypted data using XOR decryption with the provided key.
    Since XOR is symmetric, the same function can be used for encryption and decryption.
    """
    decrypted = b''.join([bytes([byte ^ ord(key[i % len(key)])]) for i, byte in enumerate(encrypted_data)])
    return decrypted

import datetime
import hashlib
import hmac
from django.conf import settings
from datetime import timezone,datetime,timedelta

def generate_viewable_signed_url(file_id, expiration_minutes=10):
    """
    Generates a signed URL for viewing content with an expiration time.
    """
    expiration_time = datetime.now(timezone.utc) +timedelta(minutes=expiration_minutes)
    expiration_timestamp = int(expiration_time.timestamp())

    # Generate HMAC signature
    secret_key = settings.SECRET_KEY.encode()
    data = f"{file_id}-{expiration_timestamp}".encode()
    signature = hmac.new(secret_key, data, hashlib.sha256).hexdigest()

    # Construct the signed URL
    signed_url = f"{settings.SITE_URL}/api/view-content/{file_id}/?exp={expiration_timestamp}&sig={signature}"
    return signed_url


def validate_signed_url(file_id, expiration_timestamp, signature):
    """
    Validates the signed URL and checks if it is expired.
    """
    current_time = datetime.now(timezone.utc)
    expiration_time = datetime.fromtimestamp(int(expiration_timestamp), timezone.utc)

    # Check if the link is expired
    if current_time > expiration_time:
        return False  # Expired link

    # Validate the signature
    data = f"{file_id}-{expiration_timestamp}".encode()
    secret_key = settings.SECRET_KEY.encode()
    expected_signature = hmac.new(secret_key, data, hashlib.sha256).hexdigest()

    return signature == expected_signature  # True if valid

# QR Code generation function
def generate_qr_code(secret, email, app_name="MyApp"):
    totp = pyotp.TOTP(secret)
    otp_uri = totp.provisioning_uri(name=email, issuer_name=app_name)
    qr = qrcode.make(otp_uri)
    qr_path = os.path.join(settings.MEDIA_ROOT, f"static/qrcode_{email}.png")
    qr.save(qr_path)
    return qr_path
