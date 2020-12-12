# Pet routes
from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required
from app.models import Vet, Clinic, Pet, vet_clinic
from app.routes.vet.helper import find_specialty

vet_bp = Blueprint('vet_api', __name__, url_prefix='/vet')


# Create vet profile
@vet_bp.route('', methods=['POST'])
@token_required
def create_vet(current_user):
    data = request.get_json()

    clinic = Clinic.query.filter_by(id=data['clinicId']).first()

    # add input vet to db
    new_vet = Vet(first_name=data['firstName'],
                  last_name=data['lastName'],
                  phone=data['phone'])
    new_vet.clinic.append(clinic)
    db.session.add(new_vet)

    # search for specialties from input and append
    if data['specialties']:
        for specialty_name in data['specialties']:
            specialty = find_specialty(specialty_name)

            new_vet.specialties.append(specialty)

    db.session.commit()

    return jsonify({'message': 'New pet created!'})


# update pet info
@vet_bp.route('/<pet_id>', methods=['PUT'])
@token_required
def change_pet_info(current_user, pet_id):
    pet = Pet.query.filter_by(id=pet_id).first()

    if not pet:
        return jsonify({'message': 'No such pet found!'})

    if pet.owner_id is not current_user.id:
        return jsonify({'message': 'You are not this pet\'s owner.'})

    data = request.get_json()

    pet.name = data['name']
    db.session.commit()

    return jsonify({'message': 'Pet information has been updated.'})


# Get vets info
@vet_bp.route('', methods=['GET'])
@token_required
def get_vets(current_user):
    clinic = Clinic.query.filter_by(user_id=current_user.uid).first()
    vets = Vet.query.join(vet_clinic).join(Clinic).filter(vet_clinic.c.clinic_id == clinic.id).all()

    output = []

    print(vets)
    for vet in vets:
        specialties = []
        for specialty in vet.specialties:
            specialties.append(specialty.name)

        vet_data = {'id': vet.id,
                    'firstName': vet.first_name,
                    'lastName': vet.last_name,
                    'phone': vet.phone,
                    'specialties': specialties}
        output.append(vet_data)

    return jsonify({'vets': output})


# Delete pet
@vet_bp.route('/<pet_id>', methods=['DELETE'])
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
