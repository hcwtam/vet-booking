# Pet routes
from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required
from app.models import Vet, Clinic, Pet, vet_clinic
from app.routes.vet.helper import find_specialty, find_vet_schedule

vet_bp = Blueprint('vet_api', __name__, url_prefix='/vet')


# Create vet profile
@vet_bp.route('', methods=['POST'])
@token_required
def create_vet(_):
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

    # opening hours, if input for the day empty, treat as closed on that day
    if data['schedule']:
        # Monday is 0, Tuesday is 1 etc.
        for index, week_of_day_input in enumerate(data['schedule']):
            if week_of_day_input:
                working_hours = find_vet_schedule(new_vet.id, index)
                if "startTime" in week_of_day_input:
                    working_hours.start_time = week_of_day_input['startTime']
                if "breakStartTime" in week_of_day_input:
                    working_hours.break_start_time = week_of_day_input['breakStartTime']
                if "breakEndTime" in week_of_day_input:
                    working_hours.break_end_time = week_of_day_input['breakEndTime']
                if "endTime" in week_of_day_input:
                    working_hours.end_time = week_of_day_input['endTime']

    db.session.commit()

    return jsonify({'message': 'New vet created!'})


# update vet info
@vet_bp.route('/<vet_id>', methods=['PUT'])
@token_required
def change_vet_info(_, vet_id):
    vet = Vet.query.filter_by(id=vet_id).first()

    if not vet:
        return jsonify({'message': 'No such vet found!'})

    data = request.get_json()

    vet.first_name = data['firstName']
    vet.last_name = data['lastName']
    db.session.commit()

    return jsonify({'message': 'Vet information has been updated.'})


# Get vets info
@vet_bp.route('', methods=['GET'])
@token_required
def get_vets(current_user):
    clinic = Clinic.query.filter_by(user_id=current_user.uid).first()
    vets = Vet.query.join(vet_clinic).join(Clinic).filter(vet_clinic.c.clinic_id == clinic.id).all()

    output = []

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


# Delete vet
@vet_bp.route('/<vet_id>', methods=['DELETE'])
@token_required
def delete_pet(_, vet_id):
    vet = Vet.query.filter_by(id=vet_id).first()

    if not vet:
        return jsonify({'message': 'No such vet found!'})

    db.session.delete(vet)
    db.session.commit()

    return jsonify({'message': 'The vet has been deleted!'})
