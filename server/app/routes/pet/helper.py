from app import db
from app.models import AnimalType, Illness, OpeningHours


def find_pet_type(data):
    # search for pet type id from input
    animal_type = AnimalType.query.filter_by(name=data['animalType']).first()
    if not animal_type:
        db.session.add(AnimalType(name=data['animalType']))
        animal_type = AnimalType.query.filter_by(name=data['animalType']).first()

    return animal_type


def find_illness(illness_name):
    illness = Illness.query.filter_by(name=illness_name).first()

    if not illness:
        db.session.add(Illness(name=illness_name))
        illness = Illness.query.filter_by(name=illness_name).first()

    return illness


def find_opening_hours(clinic_id, weekday):
    opening_hours = OpeningHours.query.filter_by(clinic_id=clinic_id, day_of_week=weekday).first()

    if not opening_hours:
        db.session.add(OpeningHours(clinic_id=clinic_id, day_of_week=weekday))
        opening_hours = OpeningHours.query.filter_by(clinic_id=clinic_id, day_of_week=weekday).first()

    return opening_hours
