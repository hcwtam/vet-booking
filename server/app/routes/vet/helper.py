from app import db
from app.models import AnimalType, VetSchedule


def find_specialty(animal_type_name):
    specialty = AnimalType.query.filter_by(name=animal_type_name).first()

    if not specialty:
        db.session.add(AnimalType(name=animal_type_name))
        specialty = AnimalType.query.filter_by(name=animal_type_name).first()

    return specialty


def find_vet_schedule(vet_id, weekday):
    working_hours = VetSchedule.query.filter_by(vet_id=vet_id, day_of_week=weekday).first()

    if not working_hours:
        db.session.add(VetSchedule(vet_id=vet_id, day_of_week=weekday))
        working_hours = VetSchedule.query.filter_by(vet_id=vet_id, day_of_week=weekday).first()

    return working_hours
