import datetime
import random
from django.core.management import BaseCommand
from django_seed import Seed
from customer.models import Cust, CustType
from customer.choices import MARITAL_STATUS
from core.choices import GENDER_CHOICES
from postcode.models import Postcode
from django.contrib.auth.hashers import make_password


class Command(BaseCommand):
    help = "Data seeding for Direct Customer"

    def handle(self, *args, **options):
        seeder = Seed.seeder()
        gender_list = [gender[0] for gender in GENDER_CHOICES]
        seeder.add_entity(
            Cust,
            30,
            {
                "cust_type": lambda x: CustType.objects.get(type="cust"),
                "name": lambda x: seeder.faker.name(),
                "email": lambda x: seeder.faker.email(),
                "password": lambda x: make_password(
                    Cust.objects.make_random_password(
                        length=30,
                        allowed_chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789[()[\]{}|\\`~!@#$%^&*_\-+=;:'\",<>./?]",
                    )
                ),
                "gender": lambda x: random.choice(gender_list),
                "birthdate": lambda x: seeder.faker.date_of_birth(
                    minimum_age=18, maximum_age=60
                ),
                "date_joined": lambda x: seeder.faker.date_between_dates(
                    date_start=datetime.datetime(2021, 5, 1),
                    date_end=datetime.datetime.today(),
                ),
            },
        )
        seeder.execute()
