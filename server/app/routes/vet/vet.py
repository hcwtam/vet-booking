# Vet routes
import datetime

from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required
from app.models import Vet, Clinic, vet_clinic, VetSchedule, AnimalType, vet_animalType, TimeSlot
from app.routes.booking.helper import get_weekday, check_vet_on_duty
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

# Get vet by vet_id
@vet_bp.route('/<vet_id>', methods=['GET'])
def get_vet_by_id(vet_id):
    vet = Vet.query.filter_by(id=vet_id).first()

    if not vet:
        return jsonify({'message': 'No such vet found!'})

    specialties = []
    for specialty in vet.specialties:
        specialties.append(specialty.name)

    clinics = []
    for clinicData in vet.clinic:
        clinics.append({
            'id': clinicData.id,
            'name': clinicData.name,
            'address': clinicData.address,
            'phone': clinicData.phone,
            'email': clinicData.contact_email})
    clinic = clinics[0]

    schedule = []
    vet_schedule = VetSchedule.query.filter_by(vet_id=vet_id).all()
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
                'clinic': clinic,
                'schedule': schedule}

    return jsonify({'vet': vet_data})


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


# Get vets info in same clinic as "clinic" user
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
def get_all_vets():
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


# Get filtered vets info for guests
@vet_bp.route('/guest', methods=['GET'])
def get_vets_for_guest():
    start_time = int(request.args.get('datetime'))
    # 900 * 1000 is 15 minutes
    end_time = start_time + 900 * 1000
    animal_type = request.args.get('animalType')

    # Get animal type ID
    animal_type_data = AnimalType.query.filter_by(name=animal_type).first()

    if request.args.get('vetId'):
        # get info of specific vet
        vets = Vet.query.filter_by(id=request.args.get('vetId')).all()
    else:
        # Get all vets that can treat that animal type
        vets = Vet.query.join(vet_animalType).join(AnimalType) \
            .filter(vet_animalType.c.animalType_id == animal_type_data.id).all()

    output = []

    for vet in vets:
        # check if input time clashes with existing timeslot
        clash = TimeSlot.query.filter(TimeSlot.vet_id == vet.id, TimeSlot.start_time <= start_time,
                                      TimeSlot.end_time >= end_time).first()
        if clash:
            continue

        # check if input time is within vet working hours
        start_datetime = datetime.datetime.fromtimestamp(start_time / 1e3)
        weekday = get_weekday(start_datetime)
        vet_working_hours = VetSchedule.query.filter(VetSchedule.day_of_week == weekday).first()
        if vet_working_hours is None:
            continue

        vet_on_duty = check_vet_on_duty(start_datetime, vet_working_hours)
        if not vet_on_duty:
            continue

        specialties = []
        for specialty in vet.specialties:
            specialties.append(specialty.name)

        clinics = []
        for clinicData in vet.clinic:
            clinics.append({
                'id': clinicData.id,
                'name': clinicData.name,
                'address': clinicData.address,
                'phone': clinicData.phone,
                'email': clinicData.contact_email})
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
                    'clinic': clinic,
                    'schedule': schedule}
        output.append(vet_data)

    return jsonify({'vets': output})
