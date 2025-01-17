import pyotp
import qrcode
import os
from django.conf import settings
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from backend_app.models import User, EncryptedFile
from .serializers import RegisterSerializer, LoginSerializer
from .util import generate_jwt,encrypt_file,decrypt_file,generate_qr_code
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse, HttpResponse


class GetQRView(APIView):
    def get(self, request, email):
        # Get user by email
        user = get_object_or_404(User, email=email)

        # Generate QR code for the user
        qr_path = generate_qr_code(user.secret, email)
        # Open the saved QR code image and return it as a response
        with open(qr_path, 'rb') as qr_file:
            response = HttpResponse(qr_file.read(), content_type="image/png")
            response['Content-Disposition'] = f'inline; filename="qrcode_{email}.png"'
            return response
        #return Response({"qr_code_path": qr_path})
    
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
        EncryptedFile.objects.all().delete()
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

class GetNameView(APIView):
    def get(self, request, email):
        user = User.objects.filter(email=email).first()
        if not user:
            raise NotFound("User not found")
        return Response({"role": user.name})


class UploadFileView(APIView):
    def post(self, request):
        # Retrieve the file and encryption key
        file = request.FILES.get("file")
        key = request.data.get("key")  # Use request.data for form data

        # Validate that both file and key are provided
        if not file or not key:
            raise ValidationError("File and key are required")

        # Perform encryption (ensure your encryption function works with file.read())
        encrypted_data = encrypt_file(file.read(), key)

        # Store the encrypted file and key in the database
        EncryptedFile.objects.create(
            filename=file.name,
            encrypted_data=encrypted_data,
            encryption_key=key
        )

        return Response({"message": "File encrypted and uploaded successfully"})
 
from rest_framework.response import Response

class DownloadFileView(APIView):
    def post(self, request):
        filename = request.data.get('filename')
        key = request.data.get('key')

        if not filename or not key:
            return Response({"error": "Both filename and encryption key are required."}, status=400)

        encrypted_files = EncryptedFile.objects.filter(filename=filename)

        if not encrypted_files.exists():
            return Response({"error": "File not found"}, status=404)

        if encrypted_files.count() > 1:
            file_list = [file.filename for file in encrypted_files]
            return Response({
                "error": "Multiple files found, please specify one",
                "files": file_list
            }, status=400)

        encrypted_file = encrypted_files.first()

        try:
            decrypted_data = decrypt_file(encrypted_file.encrypted_data, key)
        except Exception as e:
            return Response({"error": f"Failed to decrypt file: {str(e)}"}, status=400)

        response = Response(decrypted_data, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename={filename}'
        return response
    
class GetFilesView(APIView):
    def get(self, request):
        files = EncryptedFile.objects.all().values('id', 'filename','encryption_key')
        return Response(list(files))

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import EncryptedFile

class ListFilesView(APIView):
    def get(self, request):
        # Fetch all the filenames from the database
        files = EncryptedFile.objects.values('filename')
        
        # Return the list of filenames as a JSON response
        return Response({'files': [file['filename'] for file in files]})
    
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import EncryptedFile
from .util import generate_viewable_signed_url

def generate_expirable_view_link(request, file_id):
    """
    API to generate an expirable link for viewing content.
    """
    try:
        file = EncryptedFile.objects.get(id=file_id)
        signed_url = generate_viewable_signed_url(file.id, expiration_minutes=10)
        return JsonResponse({
            'message': 'Expirable view link generated successfully.',
            'url': signed_url
        }, status=200)
    except EncryptedFile.DoesNotExist:
        return JsonResponse({'error': 'File not found.'}, status=404)

import mimetypes
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os
from .util import validate_signed_url
from .models import EncryptedFile

def get_file_type(file_path):
    """
    Utility function to get the MIME type of a file dynamically.
    """
    if file_path and os.path.exists(file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        return mime_type or "application/octet-stream"
    return "application/octet-stream"

def view_content(request, file_id):
    """
    View to validate the signed URL and display the content.
    """
    expiration_timestamp = request.GET.get('exp')
    signature = request.GET.get('sig')

    if not expiration_timestamp or not signature:
        return JsonResponse({'error': 'Invalid URL parameters.'}, status=400)

    # Validate the signed URL
    if not validate_signed_url(file_id, expiration_timestamp, signature):
        return JsonResponse({'error': 'Invalid or expired link.'}, status=403)  # Forbidden

    # Fetch and process the file
    file = get_object_or_404(EncryptedFile, id=file_id)
    file_path = os.path.join(settings.MEDIA_ROOT, file.filename)  # Assuming the file is saved in MEDIA_ROOT

    # Dynamically determine the file type
    file_type = get_file_type(file_path)

    # Handle content display based on file type
    if file_type == 'text/plain':
        # If the file is a text file, open and return its content
        with open(file_path, 'r') as f:
            return HttpResponse(f.read(), content_type='text/plain')

    if file_type.startswith('image/'):
        # If the file is an image, return the image data
        with open(file_path, 'rb') as f:
            return HttpResponse(f.read(), content_type=file_type)

    if file_type == 'application/pdf':
        # If the file is a PDF, return it as a PDF
        with open(file_path, 'rb') as f:
            return HttpResponse(f.read(), content_type='application/pdf')

    # Handle unsupported file types
    return HttpResponse("Unsupported content type.", status=415)  # Unsupported Media Type