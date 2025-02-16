from django.urls import path
from .views import (HomeView,RegisterView,GetUsersView,GetQRView,ValidateOTPView,LoginView,UploadFileView,DecryptFileView,
                    FileShareView,FileShareDataView,FileListView,ServeFileView,TokenManager,GetUserView)

urlpatterns = [
    path('', HomeView(), name='home'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/<str:email>/', GetUsersView.as_view(), name='get_users'),
    path('users/', GetUserView.as_view(), name='get_users'),
    path('get-qr/<str:email>/', GetQRView.as_view(), name='get_qr'),
    path('validate-otp/<str:email>/', ValidateOTPView.as_view(), name='validate_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('upload-file/', UploadFileView.as_view(), name='upload_file'),
    path('decrypt-file/<str:filename>/', DecryptFileView.as_view(), name='decrypt-file'),
    path('file-share/', FileShareView.as_view(), name='file_share'),
    path('shared-files/<str:user>/', FileShareDataView.as_view(), name='get_users'),
    path('fileslist/<str:email>/', FileListView.as_view(), name='get_files'),
    path('serve-file/<str:filename>/', ServeFileView.as_view(), name='serve-files'),
    path('refresh-token/', TokenManager, name='refresh_token'),
]