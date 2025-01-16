import pyotp
import qrcode
import os
from django.conf import settings
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from backend_app.models import User, EncryptedFile
from .serializers import RegisterSerializer, LoginSerializer
from .util import generate_jwt
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken


# QR Code generation
def generate_qr_code(secret, email, app_name="MyApp"):
    totp = pyotp.TOTP(secret)
    otp_uri = totp.provisioning_uri(name=email, issuer_name=app_name)
    qr = qrcode.make(otp_uri)
    qr_path = os.path.join(settings.MEDIA_ROOT, f"static/qrcode_{email}.png")
    qr.save(qr_path)
    return f"{settings.MEDIA_URL}qrcode_{email}.png"
 
# AES encryption
def encrypt_file(file_data, key):
    key = key.ljust(32)[:32].encode('utf-8')  # Ensure the key is 32 bytes
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    padder = PKCS7(128).padder()
    padded_data = padder.update(file_data) + padder.finalize()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    return iv + encrypted_data
 

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if User.objects.filter(email=data['email']).exists():
            raise ValidationError("Email already registered")

        secret = pyotp.random_base32()
        password_hash = make_password(data['password'])  # Hash the password

        user = User.objects.create(
            email=data['email'],
            name=data['name'],
            password=password_hash,  # Save the hashed password
            secret=secret,
            access=data['access']
        )

        qr_path = generate_qr_code(secret, user.email)
        return Response({"message": "User registered successfully", "qr_code_path": qr_path})
 
class GetQRView(APIView):
    def get(self, request, email):
        user = User.objects.filter(email=email).first()
        if not user:
            raise NotFound("User not found")
        qr_path = generate_qr_code(user.secret, email)
        return Response({"qr_code_path": qr_path})
 
class ValidateOTPView(APIView):
    def post(self, request, email):
        # Ensure the request contains data as a dictionary
        if isinstance(request.data, dict):
            otp = request.data.get("otp")
            
            # Check if OTP is provided
            if otp is None:
                raise ValidationError("OTP is required")
            
            # Retrieve user based on the provided email
            user = User.objects.filter(email=email).first()
            if not user:
                raise NotFound("User not found")
            
            # Create the TOTP object and verify the OTP
            totp = pyotp.TOTP(user.secret)
            if totp.verify(otp):
                return Response({"message": "OTP is valid"})
            else:
                raise ValidationError("Invalid OTP")
        else:
            raise ValidationError("Invalid request format")

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = User.objects.filter(email=data['email']).first()
        if not user or not user.check_password(data['password']):  # Verify hashed password
            raise ValidationError("Invalid email or password")

        tokens = generate_jwt(user)

        return Response({
            'refresh': tokens['refresh'],
            'access': tokens['access'],
        })

class DropUsersView(APIView):
    def get(self, request):
        User.objects.all().delete()
        return Response({"message": "All users deleted successfully"})
 
class GetUsersView(APIView):
    def get(self, request):
        users = User.objects.all().values('email', 'name', 'access', 'secret','password')
        return Response(list(users))
 
class GetRoleView(APIView):
    def get(self, request, email):
        user = User.objects.filter(email=email).first()
        if not user:
            raise NotFound("User not found")
        return Response({"role": user.access})


class UploadFileView(APIView):
    def get(self, request):
        file = request.FILES.get("file")
        key = request.POST.get("key") 
        if not file or not key:
            raise ValidationError("File and key are required")
 
        encrypted_data = encrypt_file(file.read(), key)
        EncryptedFile.objects.create(
        filename=file.name,
            encrypted_data=encrypted_data,
            encryption_key=key
        )
        return Response({"message": "File encrypted and uploaded successfully"})
 
class GetFilesView(APIView):
    def get(self, request):
        files = EncryptedFile.objects.all().values('id', 'filename')
        return Response(list(files))