import datetime
import random
from django.core.management import BaseCommand
from django_seed import Seed
from customer.models import Cust, CustPosReg, CustType
from customer.choices import MARITAL_STATUS
from core.choices import GENDER_CHOICES
from postcode.models import Postcode


class Command(BaseCommand):
    help = "Data seeding for Agent/Dropshipper"

    def handle(self, *args, **options):
        seeder = Seed.seeder()
        marital_list = [marital[0] for marital in MARITAL_STATUS]
        gender_list = [gender[0] for gender in GENDER_CHOICES]
        position_list = CustType.objects.filter(type__in=["agent", "drpshpr"])
        seeder.add_entity(
            CustPosReg,
            60,
            {
                "name": lambda x: seeder.faker.name(),
                "marital_status": lambda x: random.choice(marital_list),
                "email": lambda x: seeder.faker.email(),
                "phone_num": lambda x: seeder.faker.numerify(text="01########"),
                "gender": lambda x: random.choice(gender_list),
                "birthdate": lambda x: seeder.faker.date_of_birth(
                    minimum_age=18, maximum_age=60
                ),
                "address": lambda x: seeder.faker.address(),
                "occupation": lambda x: seeder.faker.job(),
                "comp_name": lambda x: None,
                "position": lambda x: random.choice(list(position_list)),
                "postcode": lambda x: random.choice(list(Postcode.objects.all())),
                "accept": lambda x: True,
                "is_deleted": lambda x: False,
                "created_at": lambda x: seeder.faker.date_between_dates(
                    date_start=datetime.datetime(2021, 5, 1),
                    date_end=datetime.datetime.today(),
                ),
                "last_update": lambda x: datetime.datetime.now(),
            },
        )
        seeder.execute()
