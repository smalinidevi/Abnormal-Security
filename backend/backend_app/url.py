from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (RegisterView, GetQRView,GetNameView,DownloadFileView,ListFilesView, ValidateOTPView, LoginView, DropUsersView,GetUsersView, GetRoleView, UploadFileView, 
                    GetFilesView,generate_expirable_view_link,view_content)
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
    path('fetch-name/<str:email>/',GetNameView.as_view(), name='get_name'),
    path('download-file/', DownloadFileView.as_view(), name='download_file'),
    path('list-files/', ListFilesView.as_view(), name='list_files'),
    path('api/generate-view-link/<int:file_id>/', generate_expirable_view_link, name='generate_view_link'),
    path('api/view-content/<int:file_id>/', view_content, name='view_content'),
]
