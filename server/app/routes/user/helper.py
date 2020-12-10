from app import db
from app.models import AnimalType


def find_animal_type(animal_type_name):
    animal_type = AnimalType.query.filter_by(name=animal_type_name).first()

    if not animal_type:
        db.session.add(AnimalType(name=animal_type_name))
        animal_type = AnimalType.query.filter_by(name=animal_type_name).first()

    return animal_type
