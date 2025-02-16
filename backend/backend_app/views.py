from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.http import HttpResponse
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
from .utils import generate_qr_code,encrypt_file,decrypt_file
from .models import User, EncryptedFile,FileSharingInfo
from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES
from django.http import FileResponse,JsonResponse
from django.contrib.auth.hashers import make_password
from django.utils.html import escape
from django.urls import reverse
import io

class HomeView:
    """
    View to display all available URL links.
    """
    def __call__(self, request):
        links = [
            ("Register", reverse("register")),
            ("Get Users by Email", reverse("get_users", kwargs={"email": "test@example.com"})),
            ("Get QR by Email", reverse("get_qr", kwargs={"email": "test@example.com"})),
            ("Validate OTP", reverse("validate_otp", kwargs={"email": "test@example.com"})),
            ("Login", reverse("login")),
            ("Upload File", reverse("upload_file")),
            ("Decrypt File", reverse("decrypt-file", kwargs={"filename": "example.txt"})),
            ("File Share", reverse("file_share")),
            ("Shared Files", reverse("get_users", kwargs={"user": "user1"})),
            ("Files List by Email", reverse("get_files", kwargs={"email": "test@example.com"})),
            ("Serve File", reverse("serve-files", kwargs={"filename": "example.txt"}))
        ]

        html_content = "<h1>Available Links</h1><ul>"
        for link_name, link_url in links:
            html_content += f'<li><a href="{link_url}">{link_name}</a></li>'
        html_content += "</ul>"

        return HttpResponse(html_content)


class TokenManager:
    """Handles the generation and sanitization of JWT tokens."""

    @staticmethod
    def generate_tokens(user):
        """Generate access and refresh tokens for the given user."""
        refresh = RefreshToken.for_user(user)
        access_token = escape(str(refresh.access_token))
        refresh_token = escape(str(refresh))
        return access_token, refresh_token


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def sanitize_input(self, value):
        """Sanitize input by stripping spaces and escaping HTML characters."""
        return escape(value.strip()) if isinstance(value, str) else value

    def post(self, request):
        data = {k: self.sanitize_input(v) for k, v in request.data.items()}

        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        access_level = data.get("access")

        # Validate required fields
        if not all([email, password, name, access_level]):
            return Response({"detail": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Secure password storage
        hashed_password = make_password(password)

        # Generate OTP secret
        secret = pyotp.random_base32()

        # Create and save user
        user = User.objects.create(
            email=email,
            password=hashed_password,
            name=name,
            secret=secret,
            access=access_level,
        )

        # QR code generation for MFA
        qr_path = generate_qr_code(secret, email)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            'access': access_token,
            'refresh': refresh_token,
            'role': user.access,
            "detail": "User registered successfully",
            "qr_code_path": qr_path,
        }, status=status.HTTP_201_CREATED)

class GetQRView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, email):
        sanitized_email = escape(email.strip())
        user = get_object_or_404(User, email=sanitized_email)

        qr_path = generate_qr_code(user.secret, sanitized_email)
        try:
            with open(qr_path, "rb") as qr_file:
                response = HttpResponse(qr_file.read(), content_type="image/png")
                response["Content-Disposition"] = f'inline; filename="qrcode_{sanitized_email}.png"'
                return response
        except FileNotFoundError:
            return Response({"detail": "QR Code not found"}, status=status.HTTP_404_NOT_FOUND)


class ValidateOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, email):
        sanitized_email = escape(email.strip())
        otp = escape(request.data.get("otp", "").strip())

        if not otp or not otp.isdigit() or len(otp) != 6:
            return Response({"detail": "Invalid OTP format"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, email=sanitized_email)
        totp = pyotp.TOTP(user.secret)

        if totp.verify(otp):
            return JsonResponse({
                "message": escape("OTP is valid"),
                "role": escape(user.access),
            })

        return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Extract email and password from request
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the user based on email
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check the password using Django's check_password
        if not check_password(password, user.password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Return the tokens
        return Response({
            'access': access_token,
            'refresh': refresh_token,
            'role': user.access
        })

class GetUsersView(APIView):
    permission_classes = [AllowAny]
    def get(self, request,email):
        users = User.objects.exclude(email=email).values('email', 'name', 'access', 'secret', 'password')
        return Response({"users": users}, status=status.HTTP_200_OK)

class GetUserView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        users = User.objects.all().values('email', 'name', 'access', 'secret','password')
        return Response(list(users))


class UploadFileView(APIView):
    permission_classes = [AllowAny]  # Optional: adjust based on your security needs
    def post(self, request):
        file = request.FILES.get("file")
        email = request.data.get("email")

        if not file:
            raise ValidationError("File is required")
        if not email:
            raise ValidationError("Email is required")

        # Check if the file already exists
        if EncryptedFile.objects.filter(filename=file.name, email=email).exists():
            raise ValidationError(f"File '{file.name}' for user '{email}' already exists.")

        # Generate encryption key and IV
        encryption_key = get_random_bytes(32)  # AES-256 key
        iv = get_random_bytes(AES.block_size)  # Generate IV

        # Encrypt the file
        encrypted_data = encrypt_file(file, encryption_key, iv)

            # Fetch the user instance by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise ValidationError(f"'{email}' not found.")

        # Save the file
        EncryptedFile.objects.create(
            email=user,
            filename=file.name,
            encrypted_file=encrypted_data,
            encryption_key=encryption_key,  # Store as bytes
            iv=iv  # Store IV separately
        )

        return Response({
            "message": "File encrypted and uploaded successfully"
        }, status=201)


class DecryptFileView(APIView):
    permission_classes = [AllowAny]  # Optional: adjust based on your security needs
    def get(self, request, filename):
        try:
            encrypted_file = EncryptedFile.objects.get(filename=filename)
        except EncryptedFile.DoesNotExist:
            raise ValidationError(f"File with name '{filename}' not found.")
        
        # Get the encrypted data, key, and IV
        encrypted_data = encrypted_file.encrypted_file
        encryption_key = encrypted_file.encryption_key
        iv = encrypted_file.iv
        
        # Decrypt the file
        decrypted_file = decrypt_file(encrypted_data, encryption_key, iv)
        
        # Prepare response
        response = HttpResponse(decrypted_file, content_type="application/octet-stream")
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class FileShareView(APIView):
    permission_classes = [AllowAny]  # Optional: adjust based on your security needs

    def post(self, request):
        try:
            user_email = request.data.get('user')
            file_name = request.data.get('file')
            permission = request.data.get('permission')
            sender_email = request.data.get('sender')

            # Validate required fields
            if not all([user_email, file_name, permission, sender_email]):
                return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch related model instances
            try:
                user = User.objects.get(email=user_email)
            except User.DoesNotExist:
                return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

            try:
                file = EncryptedFile.objects.get(filename=file_name)
            except EncryptedFile.DoesNotExist:
                return Response({"error": "File does not exist."}, status=status.HTTP_404_NOT_FOUND)

            # Save the new entry
            FileSharingInfo.objects.create(
                user=user, file=file, permission=permission, sender=sender_email
            )
            return Response({"message": "File shared successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileShareDataView(APIView):
    permission_classes = [AllowAny]  # Optional: adjust based on your security needs
    def get(self, request, user):
        try:
            # Validate if user exists
            try:
                user = User.objects.get(email=user)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            # Query shared data for the specified user
            shared_data = FileSharingInfo.objects.filter(user=user)

            # Structure response as list of rows
            data = [
                {
                    "sender": item.sender,
                    "file": item.file.filename,
                    "permission": item.permission
                }
                for item in shared_data
            ]

            return Response({"files":list(data)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileListView(APIView):
    permission_classes = [AllowAny]  # Optional: adjust based on your security needs
    def get(self, request, email):
        try:
            # Fetch only files belonging to the given email
            files = EncryptedFile.objects.filter(email=email).values('filename')
            return Response({"files":list(files)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ServeFileView(APIView):
    permission_classes = [AllowAny]  # Optional: adjust based on your security needs
    def get(self,request, filename):
        try:
            encrypted_file = EncryptedFile.objects.get(filename=filename)
        except EncryptedFile.DoesNotExist:
            raise ValidationError(f"File with name '{filename}' not found.")
        
        # Get the encrypted data, key, and IV
        encrypted_data = encrypted_file.encrypted_file
        encryption_key = encrypted_file.encryption_key
        iv = encrypted_file.iv
        
        # Decrypt the file
        file = decrypt_file(encrypted_data, encryption_key, iv)
        # Serve the decrypted file as a download response
        file_stream = io.BytesIO(file)
        return FileResponse(
            file_stream,
            as_attachment=True,
            filename=filename,
            content_type='application/pdf'
        )
    