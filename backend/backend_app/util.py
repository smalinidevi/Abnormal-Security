from rest_framework_simplejwt.tokens import RefreshToken
 
def generate_jwt(user):
    # Generate refresh and access tokens for the user
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }