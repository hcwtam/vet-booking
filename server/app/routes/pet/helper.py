from app import db
from app.models import Pet, AnimalType, Illness


def find_pet_type(data, current_user):

    # search for pet type id from input
    animal_type = AnimalType.query.filter_by(name=data['animalType']).first()
    if not animal_type:
        db.session.add(AnimalType(name=data['animalType']))
        animal_type = AnimalType.query.filter_by(name=data['animalType']).first()

    # add to db
    new_pet = Pet(name=data['name'],
                  animal_id=animal_type.id,
                  gender=data['gender'],
                  desexed=data['desexed'] == "true",
                  owner_id=current_user.id)

    return new_pet


def find_illness(illness_name):

    illness = Illness.query.filter_by(name=illness_name).first()

    if not illness:
        db.session.add(Illness(name=illness_name))
        illness = Illness.query.filter_by(name=illness_name).first()

    return illness
