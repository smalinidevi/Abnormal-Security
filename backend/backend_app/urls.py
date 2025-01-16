from django.urls import path
from .views import (RegisterView, GetQRView, ValidateOTPView, LoginView, DropUsersView,GetUsersView, GetRoleView, UploadFileView, GetFilesView)
from rest_framework_simplejwt import views as jwt_views 
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('get-qr/<str:email>/', GetQRView.as_view(), name='get_qr'),
    path('validate-otp/<str:email>/', ValidateOTPView.as_view(), name='validate_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('drop/', DropUsersView.as_view(), name='drop_users'),
    path('users/', GetUsersView.as_view(), name='get_users'),
    path('role/<str:email>/', GetRoleView.as_view(), name='get_role'),
    path('upload-file/', UploadFileView.as_view(), name='upload_file'),
    path('files/', GetFilesView.as_view(), name='get_files'),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]