from rest_framework import serializers
from .models import User
 
class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
 
    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'confirm_password', 'access']
 
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data
 
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)
 
    def validate(self, data):
        if not data.get('email') or not data.get('password'):
            raise serializers.ValidationError("Email and password are required.")
        return data