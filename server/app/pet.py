# Pet routes
import datetime
import os
import jwt
from flask import Blueprint, jsonify, request, make_response, current_app as app
import uuid

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
                  animal_id=data['animal_id'],  # TODO
                  gender=data['gender'],
                  illness_id=data['illness_id'],  # TODO
                  desexed=data['desexed'],
                  owner_id=current_user.id)
    db.session.add(new_pet)
    db.session.commit()

    return jsonify({'message': 'New pet created!'})


# update pet info
@pet_bp.route('/<uid>', methods=['PUT'])
@token_required
def change_pet_info(current_user, uid):
    pet = Pet.query.filter_by(id=uid).first()

    if not pet:
        return jsonify({'message': 'No such pet found!'})

    if pet.owner_id is not current_user.id:
        return jsonify({'message': 'You are not this pet\'s owner.'})

    data = request.get_json()

    pet.name = data['name']
    pet.illness_id = data['illness_id']
    db.session.commit()

    return jsonify({'message': 'Pet information has been updated.'})


# Get pets info
@pet_bp.route('', methods=['GET'])
@token_required
def get_pets(current_user):
    pets = Pet.query.filter_by(owner_id=current_user.id).all()

    output = []

    for pet in pets:
        pet_data = {'name': pet.name, 'birth_date': pet.birth_date, 'gender': pet.gender, 'desexed': pet.desexed}
        output.append(pet_data)

    return jsonify({'pets': output})


# Delete pet
@pet_bp.route('/<uid>', methods=['DELETE'])
@token_required
def delete_pet(current_user, uid):
    pet = Pet.query.filter_by(id=uid).first()

    if not pet:
        return jsonify({'message': 'No such pet found!'})

    if pet.owner_id is not current_user.id:
        return jsonify({'message': 'You are not this pet\'s owner.'})

    db.session.delete(pet)
    db.session.commit()

    return jsonify({'message': 'The pet has been deleted!'})
