from unicodedata import category
from django_filters import rest_framework as filters

from postcode.models import Postcode


class PostcodeFilter(filters.FilterSet):

    code = filters.CharFilter(field_name="postcode")
    city = filters.CharFilter(field_name="city")
    state = filters.CharFilter(field_name="state")

    class Meta:
        model = Postcode
        fields = ["postcode", "city", "state"]
