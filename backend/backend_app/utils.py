import pyotp
import qrcode
import os
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from datetime import datetime
from .models import User,FileSharingInfo
import os
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES


# QR Code generation function
def generate_qr_code(secret, email, app_name="MyApp"):
    totp = pyotp.TOTP(secret)
    otp_uri = totp.provisioning_uri(name=email, issuer_name=app_name)
    qr = qrcode.make(otp_uri)
    qr_path = os.path.join(settings.MEDIA_ROOT, f"static/qrcode_{email}.png")
    qr.save(qr_path)
    return qr_path

# JWT generation function
def generate_jwt(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

#refresh token view
def verify_refresh_token(refresh_token):
    try:
        # Decode the refresh token
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        
        # Check if the token is expired
        if datetime.utcnow() > datetime.utcfromtimestamp(payload['exp']):
            raise Exception('Token has expired')

        # Retrieve the user based on the token
        user = User.objects.get(id=payload['user_id'])
        return user
    except Exception as e:
        raise Exception('Invalid refresh token')
    
def encrypt_file(input_file, key, iv):
        # Create cipher
        cipher = AES.new(key, AES.MODE_CBC, iv)
        
        # Read and pad the file data
        file_data = input_file.read()
        padded_data = pad(file_data, AES.block_size)
        
        # Encrypt the data
        encrypted_data = cipher.encrypt(padded_data)
        
        return encrypted_data  # Return only encrypted data

def decrypt_file(encrypted_data, key, iv):
        # Create cipher with stored IV
        cipher = AES.new(key, AES.MODE_CBC, iv)
        
        # Decrypt and unpad
        decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
        
        return decrypted_data

def save_file_sharing_info(data):
    FileSharingInfo.objects.create(
        user=data['user'],
        file=data['file'],
        permission=data['permission']
    )