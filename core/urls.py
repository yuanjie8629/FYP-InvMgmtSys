from django.urls import include, path
from .views import BlacklistToken, CookieTokenObtainPairView, CookieTokenRefreshView, MyTokenVerifyView
urlpatterns = [
    path("admin/", include("administrator.urls")),
    path("login/", CookieTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path('token/verify/', MyTokenVerifyView.as_view(), name='token_verify'),
    path("logout/", BlacklistToken.as_view(), name="logout"),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]