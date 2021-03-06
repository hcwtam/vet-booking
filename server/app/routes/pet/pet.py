# Pet routes
from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required
from app.models import Pet, AnimalType, PetOwner
from app.routes.pet.helper import find_pet_type, find_illness

pet_bp = Blueprint('pet_api', __name__, url_prefix='/pet')


# Create pet profile
@pet_bp.route('', methods=['POST'])
@token_required
def create_pet(current_user):
    data = request.get_json()
    pet_owner = PetOwner.query.filter_by(user_id=current_user.uid).first()

    animal_type = find_pet_type(data)

    # add found pet to db
    new_pet = Pet(name=data['name'],
                  animal_id=animal_type.id,
                  gender=data['gender'],
                  desexed=data['desexed'] == "true",
                  owner_id=pet_owner.id)
    db.session.add(new_pet)

    # search for illness from input and append
    if data['illness']:
        for illness_name in data['illness']:
            illness = find_illness(illness_name)

            new_pet.illnesses.append(illness)

    db.session.commit()

    return jsonify({'message': 'New pet created!'})


# update pet info
@pet_bp.route('/<pet_id>', methods=['PUT'])
@token_required
def change_pet_info(current_user, pet_id):
    pet = Pet.query.filter_by(id=pet_id).first()

    if not pet:
        return jsonify({'message': 'No such pet found!'})

    pet_owner = PetOwner.query.filter_by(user_id=current_user.uid).first()
    if pet.owner_id is not pet_owner.id:
        return jsonify({'message': 'You are not this pet\'s owner.'})

    data = request.get_json()

    pet.name = data['name']
    db.session.commit()

    return jsonify({'message': 'Pet information has been updated.'})


# Get pets info
@pet_bp.route('', methods=['GET'])
@token_required
def get_pets(current_user):
    pet_owner = PetOwner.query.filter_by(user_id=current_user.uid).first()
    pets = Pet.query.filter_by(owner_id=pet_owner.id).all()

    output = []

    for pet in pets:
        animal_type = AnimalType.query.filter_by(id=pet.animal_id).first()

        illnesses = []
        for illness in pet.illnesses:
            illnesses.append(illness.name)

        pet_data = {'id': pet.id,
                    'name': pet.name,
                    'animalType': animal_type.name,
                    'birthDate': pet.birth_date,
                    'gender': pet.gender,
                    'desexed': pet.desexed,
                    'illnesses': illnesses}
        output.append(pet_data)

    return jsonify({'pets': output})


# Delete pet
@pet_bp.route('/<pet_id>', methods=['DELETE'])
@token_required
def delete_pet(current_user, pet_id):
    pet = Pet.query.filter_by(id=pet_id).first()

    if not pet:
        return jsonify({'message': 'No such pet found!'})

    pet_owner = PetOwner.query.filter_by(user_id=current_user.uid).first()
    if pet.owner_id is not pet_owner.id:
        return jsonify({'message': 'You are not this pet\'s owner.'})

    db.session.delete(pet)
    db.session.commit()

    return jsonify({'message': 'The pet has been deleted!'})
