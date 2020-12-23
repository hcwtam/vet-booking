# Vet routes
from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required
from app.models import Vet, Clinic, vet_clinic, VetSchedule
from app.routes.vet.helper import find_specialty, set_new_schedule

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
        set_new_schedule(data['schedule'], new_vet.id)

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
    # search for specialties from input and append
    if data['specialties']:
        vet.specialties = []
        for specialty_name in data['specialties']:
            specialty = find_specialty(specialty_name)
            vet.specialties.append(specialty)
    if data['schedule']:
        set_new_schedule(data['schedule'], vet_id)
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

        clinics = []
        for clinicData in vet.clinic:
            clinics.append({
                'id': clinicData.id,
                'name': clinicData.name
            })
        clinic = clinics[0]

        schedule = []
        vet_schedule = VetSchedule.query.filter_by(vet_id=vet.id).all()
        for working_hours in vet_schedule:
            schedule.append({
                'dayOfWeek': working_hours.day_of_week,
                'startTime': working_hours.start_time,
                'breakStartTime': working_hours.break_start_time,
                'breakEndTime': working_hours.break_end_time,
                'endTime': working_hours.end_time,
            })

        vet_data = {'id': vet.id,
                    'firstName': vet.first_name,
                    'lastName': vet.last_name,
                    'phone': vet.phone,
                    'specialties': specialties,
                    'schedule': schedule,
                    'clinic': clinic}
        output.append(vet_data)

    return jsonify({'vets': output})


# Delete vet
@vet_bp.route('/<vet_id>', methods=['DELETE'])
@token_required
def delete_vet(_, vet_id):
    vet = Vet.query.filter_by(id=vet_id).first()

    if not vet:
        return jsonify({'message': 'No such vet found!'})

    db.session.query(VetSchedule).filter(VetSchedule.vet_id == vet_id).delete()

    db.session.delete(vet)
    db.session.commit()

    return jsonify({'message': 'The vet has been deleted!'})


# get all vets
@vet_bp.route('/all', methods=['GET'])
@token_required
def get_all_vets(_):
    vets = Vet.query.all()

    output = []

    for vet in vets:
        specialties = []
        for specialty in vet.specialties:
            specialties.append(specialty.name)

        clinics = []
        for clinicData in vet.clinic:
            clinics.append({
                'id': clinicData.id,
                'name': clinicData.name
            })
        clinic = clinics[0]

        schedule = []
        vet_schedule = VetSchedule.query.filter_by(vet_id=vet.id).all()
        for working_hours in vet_schedule:
            schedule.append({
                'dayOfWeek': working_hours.day_of_week,
                'startTime': working_hours.start_time,
                'breakStartTime': working_hours.break_start_time,
                'breakEndTime': working_hours.break_end_time,
                'endTime': working_hours.end_time,
            })

        vet_data = {'id': vet.id,
                    'firstName': vet.first_name,
                    'lastName': vet.last_name,
                    'phone': vet.phone,
                    'specialties': specialties,
                    'schedule': schedule,
                    'clinic': clinic}
        output.append(vet_data)

    return jsonify({'vets': output})
