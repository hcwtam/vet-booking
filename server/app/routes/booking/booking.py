# Booking routes
import datetime

from flask import Blueprint, jsonify, request

from app import db
from app.helper import token_required, token_optional
from app.models import Vet, Clinic, Pet, vet_clinic, VetSchedule, TimeSlot, Booking, PetOwner
from app.routes.booking.helper import get_weekday, check_vet_on_duty
from app.routes.vet.helper import find_specialty, find_vet_schedule, set_new_schedule

booking_bp = Blueprint('booking_api', __name__, url_prefix='/booking')


# Create booking profile
@booking_bp.route('', methods=['POST'])
@token_optional
def create_booking(current_user=None):
    data = request.get_json()
    start_time = data['datetime']
    # 900 * 1000 is 15 minutes
    end_time = start_time + 900 * 1000

    # check if input time clashes with existing timeslot
    clash = TimeSlot.query.filter(TimeSlot.vet_id == data['vetId'], TimeSlot.start_time <= start_time,
                                  TimeSlot.end_time >= end_time).first()
    if clash:
        return jsonify({'message': 'Conflict with existing bookings'}), 400

    # check if input time is within vet working hours
    start_datetime = datetime.datetime.fromtimestamp(start_time / 1e3)
    weekday = get_weekday(start_datetime)
    vet_working_hours = VetSchedule.query.filter(VetSchedule.day_of_week == weekday).first()
    if vet_working_hours is None:
        return jsonify({'message': 'Vet is not working on this day'}), 400

    vet_on_duty = check_vet_on_duty(start_datetime, vet_working_hours)
    if not vet_on_duty:
        return jsonify({'message': 'Not within vet working hour'}), 400

    # add booking to db
    new_time_slot = TimeSlot(start_time=start_time,
                             end_time=end_time,
                             vet_id=data['vetId'])
    db.session.add(new_time_slot)
    db.session.flush()
    db.session.refresh(new_time_slot)
    pet_id = ''
    pet_owner_id = ''
    if current_user:
        pet_owner = PetOwner.query.filter_by(user_id=current_user.uid).first()
        pet_owner_id = pet_owner.id
        pet_id = data['petId']
    new_booking = Booking(
        pet_id=pet_id,
        owner_id=pet_owner_id,
        time_slot_id=new_time_slot.id,
        vet_id=data['vetId'],
        clinic_id=data['clinicId']
    )
    db.session.add(new_booking)
    db.session.commit()

    return jsonify({'message': 'New booking created!'})


# Get bookings info
@booking_bp.route('', methods=['GET'])
@token_required
def get_bookings(current_user):
    pet_owner = PetOwner.query.filter_by(user_id=current_user.uid).first()
    bookings = Booking.query.filter_by(owner_id=pet_owner.id).all()

    output = []

    for booking in bookings:
        vet = Vet.query.filter_by(id=booking.vet_id).first()
        clinic = Clinic.query.filter_by(id=booking.clinic_id).first()
        time_slot = TimeSlot.query.filter_by(id=booking.time_slot_id).first()

        booking_data = {'id': booking.booking_number,
                        'petId': booking.pet_id,
                        'ownerId': booking.owner_id,
                        'vetId': vet.id,
                        'vetLastName': vet.last_name,
                        'clinicId': clinic.id,
                        'clinicName': clinic.name,
                        'clinicNumber': clinic.phone,
                        'startTime': time_slot.start_time,
                        'endTime': time_slot.end_time}
        output.append(booking_data)

    return jsonify({'bookings': output})


# TODO
# change booking time
@booking_bp.route('/<booking_number>', methods=['PUT'])
@token_required
def change_booking_time(_, booking_number):
    booking = Booking.query.filter_by(booking_number=booking_number).first()

    if not booking:
        return jsonify({'message': 'No such booking found!'})

    data = request.get_json()

    start_time = data['datetime']
    # 900 * 1000 is 15 minutes
    end_time = start_time + 900 * 1000

    # check if input time clashes with existing timeslot
    clash = TimeSlot.query.filter(TimeSlot.vet_id == booking.vet_id, TimeSlot.start_time <= start_time,
                                  TimeSlot.end_time >= end_time).first()
    if clash:
        return jsonify({'message': 'Conflict with existing bookings'}), 400

    # check if input time is within vet working hours
    start_datetime = datetime.datetime.fromtimestamp(start_time / 1e3)
    weekday = get_weekday(start_datetime)
    vet_working_hours = VetSchedule.query.filter(VetSchedule.day_of_week == weekday).first()
    if vet_working_hours is None:
        return jsonify({'message': 'Vet is not working on this day'}), 400

    vet_on_duty = check_vet_on_duty(start_datetime, vet_working_hours)
    if not vet_on_duty:
        return jsonify({'message': 'Not within vet working hour'}), 400

    # update booking from db
    time_slot = TimeSlot.query.filter_by(id=booking.time_slot_id).first()
    time_slot.start_time = start_time
    time_slot.end_time = end_time
    # trigger time_update field
    Booking.query.filter_by(booking_number=booking_number).update({'time_slot_id': time_slot.id})
    db.session.commit()

    return jsonify({'message': 'Booking time has been updated.'})


# Delete booking
@booking_bp.route('/<booking_number>', methods=['DELETE'])
@token_required
def delete_booking(_, booking_number):
    booking = Booking.query.filter_by(booking_number=booking_number).first()

    if not booking:
        return jsonify({'message': 'No such vet found!'})

    db.session.query(TimeSlot).filter(TimeSlot.id == booking.time_slot_id).delete()
    db.session.delete(booking)
    db.session.commit()

    return jsonify({'message': 'This booking has been cancelled!'})
