from app import db
from app.models import AnimalType


def find_specialty(animal_type_name):
    specialty = AnimalType.query.filter_by(name=animal_type_name).first()

    if not specialty:
        db.session.add(AnimalType(name=animal_type_name))
        specialty = AnimalType.query.filter_by(name=animal_type_name).first()

    return specialty
