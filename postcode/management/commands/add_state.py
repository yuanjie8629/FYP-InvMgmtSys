from postcode.models import State
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        insert_count = State.objects.from_csv('postcode\states.csv')
        print("{} records inserted".format(insert_count))