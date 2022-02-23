from django.urls import include, path
from .views import BlacklistToken, CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
    path("admin/", include("administrator.urls")),
    path("login/", CookieTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", BlacklistToken.as_view(), name="logout"),
]
