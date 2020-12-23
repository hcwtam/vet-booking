# Booking routes
import datetime

from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required
from app.models import Vet, Clinic, Pet, vet_clinic, VetSchedule, TimeSlot, Booking, PetOwner
from app.routes.vet.helper import find_specialty, find_vet_schedule, set_new_schedule

booking_bp = Blueprint('booking_api', __name__, url_prefix='/booking')


# Create booking profile
@booking_bp.route('', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json()
    start_time = data['datetime']
    # 900 * 1000 is 15 minutes
    end_time = start_time + 900 * 1000

    # check if input time clashes with existing timeslot
    clash = TimeSlot.query.filter(TimeSlot.vet_id == data['vetId'], TimeSlot.start_time <= start_time,
                                  TimeSlot.end_time >= end_time).first()
    if clash:
        return jsonify({'message': 'Conflict with existing bookings'}), 400

    # add booking to db
    new_time_slot = TimeSlot(start_time=start_time,
                             end_time=end_time,
                             vet_id=data['vetId'])
    db.session.add(new_time_slot)
    db.session.flush()
    db.session.refresh(new_time_slot)
    pet_owner = PetOwner.query.filter_by(user_id=current_user.uid).first()
    new_booking = Booking(
        pet_id=data['petId'],
        owner_id=pet_owner.id,
        time_slot_id=new_time_slot.id,
        vet_id=data['vetId'],
        clinic_id=data['clinicId']
    )
    db.session.add(new_booking)
    db.session.commit()

    return jsonify({'message': 'New booking created!'})


# update booking info
@booking_bp.route('/<vet_id>', methods=['PUT'])
@token_required
def change_booking_info(_, vet_id):
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


# Get bookings info
@booking_bp.route('', methods=['GET'])
@token_required
def get_bookings(current_user):
    clinic = Clinic.query.filter_by(user_id=current_user.uid).first()
    vets = Vet.query.join(vet_clinic).join(Clinic).filter(vet_clinic.c.clinic_id == clinic.id).all()

    output = []

    for vet in vets:
        specialties = []
        for specialty in vet.specialties:
            specialties.append(specialty.name)

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
                    'schedule': schedule}
        output.append(vet_data)

    return jsonify({'vets': output})


# Delete booking
@booking_bp.route('/<vet_id>', methods=['DELETE'])
@token_required
def delete_booking(_, vet_id):
    vet = Vet.query.filter_by(id=vet_id).first()

    if not vet:
        return jsonify({'message': 'No such vet found!'})

    db.session.query(VetSchedule).filter(VetSchedule.vet_id == vet_id).delete()

    db.session.delete(vet)
    db.session.commit()

    return jsonify({'message': 'The vet has been deleted!'})
