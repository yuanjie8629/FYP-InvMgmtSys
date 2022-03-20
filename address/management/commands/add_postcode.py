from address.models import Postcode
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        insert_count = Postcode.objects.from_csv('address\postcode.csv')
        print("{} records inserted".format(insert_count))