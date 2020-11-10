# Pet routes
from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required
from app.models import User, Pet

pet_bp = Blueprint('pet_api', __name__, url_prefix='/pet')


# Create pet profile
@pet_bp.route('', methods=['POST'])
@token_required
def create_pet(current_user):
    data = request.get_json()

    new_pet = Pet(name=data['name'],
                  animal_id=1,  # TODO
                  gender=data['gender'],
                  illness_id=1,  # TODO
                  desexed=data['desexed'] == "true",
                  owner_id=current_user.id)
    db.session.add(new_pet)
    db.session.commit()

    return jsonify({'message': 'New pet created!'})


# update pet info
@pet_bp.route('/<pet_id>', methods=['PUT'])
@token_required
def change_pet_info(current_user, pet_id):
    pet = Pet.query.filter_by(id=pet_id).first()

    if not pet:
        return jsonify({'message': 'No such pet found!'})

    if pet.owner_id is not current_user.id:
        return jsonify({'message': 'You are not this pet\'s owner.'})

    data = request.get_json()

    pet.name = data['name']
    pet.illness_id = 1  # TODO
    db.session.commit()

    return jsonify({'message': 'Pet information has been updated.'})


# Get pets info
@pet_bp.route('', methods=['GET'])
@token_required
def get_pets(current_user):
    pets = Pet.query.filter_by(owner_id=current_user.id).all()

    output = []

    for pet in pets:
        pet_data = {'id': pet.id,
                    'name': pet.name,
                    'birthDate': pet.birth_date,
                    'gender': pet.gender,
                    'desexed': pet.desexed}
        output.append(pet_data)

    return jsonify({'pets': output})


# Delete pet
@pet_bp.route('/<pet_id>', methods=['DELETE'])
@token_required
def delete_pet(current_user, pet_id):
    pet = Pet.query.filter_by(id=pet_id).first()

    if not pet:
        return jsonify({'message': 'No such pet found!'})

    if pet.owner_id is not current_user.id:
        return jsonify({'message': 'You are not this pet\'s owner.'})

    db.session.delete(pet)
    db.session.commit()

    return jsonify({'message': 'The pet has been deleted!'})
