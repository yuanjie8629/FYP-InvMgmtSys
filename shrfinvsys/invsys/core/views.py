from os import stat
from django.shortcuts import render
from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView,
    TokenVerifyView,
)
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
    TokenVerifySerializer,
)
from rest_framework_simplejwt.exceptions import InvalidToken


def index(request):
    return render(request, "index.html")


class CookieTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["name"] = user.name
        token["role"] = "superadmin" if user.is_superuser else "admin"

        return token


class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("access"):
            cookie_max_age = 900  # 15 minutes
            response.set_cookie(
                "access_token",
                response.data["access"],
                max_age=cookie_max_age,
                httponly=False,
            )
            del response.data["access"]

        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24  # 1 day
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieTokenObtainPairSerializer


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    permission_classes = [permissions.AllowAny]
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid token found in cookie 'refresh_token'")


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24  # 1 day
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieTokenRefreshSerializer


class BlacklistToken(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()
        response = Response(status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie("refresh_token")

        return response


class MyTokenVerifySerializer(TokenVerifySerializer):
    permission_classes = [permissions.AllowAny]
    token = None

    def validate(self, attrs):
        attrs["token"] = self.context["request"].COOKIES.get("refresh_token")
        if attrs["token"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid token found in cookie 'refresh_token'")


class MyTokenVerifyView(TokenVerifyView):
    permission_classes = [permissions.AllowAny]

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("access"):
            cookie_max_age = 900  # 15 minutes
            response.set_cookie(
                "access_token",
                response.data["access"],
                max_age=cookie_max_age,
                httponly=False,
            )
            del response.data["access"]

        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24  # 1 day
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = MyTokenVerifySerializer
