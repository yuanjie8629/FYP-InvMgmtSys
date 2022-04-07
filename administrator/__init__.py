from reversion import views
from django.urls import resolve


def _request_creates_revision(request):
    if resolve(request.path_info).url_name:
        if resolve(request.path_info).url_name.endswith("login"):
            return False

    return request.method not in ("OPTIONS", "GET", "HEAD")


views._request_creates_revision = _request_creates_revision
