from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q


class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user_model = get_user_model()

        if username is None:
            username = kwargs.get(user_model.USERNAME_FIELD)

        users = user_model._default_manager.filter(
            (Q(**{user_model.USERNAME_FIELD: username}) | Q(email__iexact=username))
            & (Q(is_superuser=True) | Q(is_staff=True))
        )

        for user in users:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        if not users:
            user_model().set_password(password)
