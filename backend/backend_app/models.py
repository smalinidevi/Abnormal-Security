from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
 
# Custom User Manager to handle user creation
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
 
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user
 
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
 
        return self.create_user(email, password, **extra_fields)
 
 
# Custom User model that extends AbstractBaseUser
class User(AbstractBaseUser):
    # Fields
    email = models.EmailField(unique=True)  # Unique email for the user
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=255)  # Password will be hashed using set_password
    secret = models.CharField(max_length=32)
    access = models.CharField(max_length=50)
 
    # Permissions
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
 
    # Timestamps
    last_login = models.DateTimeField(auto_now=True)
    date_joined = models.DateTimeField(auto_now_add=True)
 
    # Custom Manager
    objects = CustomUserManager()
 
    # Define the USERNAME_FIELD and REQUIRED_FIELDS
    USERNAME_FIELD = 'email'  # Use email for authentication
    REQUIRED_FIELDS = ['name']  # Fields required when creating a superuser
 
    # Meta class for app label
    class Meta:
        app_label = 'backend_app'
 
    def __str__(self):
        return self.email  # Return the user's email as the string representation
 
    # You can add any custom methods to the User model here
 
    @property
    def full_name(self):
        return f'{self.name} ({self.email})'
 
 
# For encrypted files (as per your request)
class EncryptedFile(models.Model):
    filename = models.CharField(max_length=255)
    encrypted_data = models.BinaryField()
    encryption_key = models.CharField(max_length=32)
 
    def __str__(self):
        return self.filename