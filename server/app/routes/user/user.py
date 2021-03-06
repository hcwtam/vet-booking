# User routes
import datetime
import os

import flask_cors
import jwt
from flask import Blueprint, jsonify, request, make_response
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

from app import db
from app.helper import token_required
from app.models import User, PetOwner, Clinic
from app.routes.pet.helper import find_opening_hours
from app.routes.user.helper import find_animal_type

user_bp = Blueprint('user_api', __name__, url_prefix='/user')
flask_cors.CORS(user_bp)


# Create account
@user_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')
    user_uid = str(uuid.uuid4())

    # check if user already exists
    email_exists = User.query.filter_by(email=data['email']).first()
    username_exists = User.query.filter_by(username=data['username']).first()
    if email_exists or username_exists:
        return jsonify({'message': 'Account exists.'})

    new_user = User(uid=user_uid,
                    first_name=data['firstName'],
                    last_name=data['lastName'],
                    email=data['email'],
                    username=data['username'],
                    password=hashed_password,
                    user_type=data['userType'])

    db.session.add(new_user)

    # create specific user type data
    if data['userType'] == 'owner':
        # check if new user has had guest booking
        pet_owner = PetOwner.query.filter_by(email=data['email']).first()
        if pet_owner:
            pet_owner.email = data['email']
            pet_owner.phone = data['phone']
            pet_owner.user_id = user_uid
        else:
            user_type_detail = PetOwner(user_id=user_uid, email=data['email'])
            db.session.add(user_type_detail)

    if data['userType'] == 'clinic':
        user_type_detail = Clinic(user_id=user_uid)
        db.session.add(user_type_detail)

    db.session.commit()

    user = User.query.filter_by(username=data['username']).first()

    token = jwt.encode(
        {'uid': user.uid, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)},
        os.environ.get("SECRET_KEY"))

    return jsonify({'token': token.decode('UTF-8'), 'userType': data['userType'], 'message': 'New user created!'})


# login
@user_bp.route('/login', methods=['POST'])
def login():
    auth = request.get_json()

    if not auth or not auth['username'] or not auth['password']:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    user = User.query.filter_by(username=auth['username']).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    if check_password_hash(user.password, auth['password']):
        token = jwt.encode(
            {'uid': user.uid, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)},
            os.environ.get("SECRET_KEY"))

        return jsonify({'token': token.decode('UTF-8'), 'userType': user.user_type})

    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})


# update user profile
@user_bp.route('/profile', methods=['PUT'])
@token_required
def change_user_detail(current_user):
    user = User.query.filter_by(uid=current_user.uid).first()

    if not user:
        return jsonify({'message': 'No user found!'})

    data = request.get_json()

    user.first_name = data['firstName']
    user.last_name = data['lastName']
    db.session.commit()

    return jsonify({'message': 'User detail has been updated'})


# get user profile
@user_bp.route('/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    user = User.query.filter_by(uid=current_user.uid).first()
    if not user:
        return jsonify({'message': 'No user found!'})

    pet_owner = PetOwner.query.filter_by(user_id=user.uid).first()
    pet_owner_id = None
    if pet_owner:
        pet_owner_id = pet_owner.id

    user_data = {'uid': user.uid,
                 'firstName': user.first_name,
                 'lastName': user.last_name,
                 'email': user.email,
                 'username': user.username,
                 'userType': user.user_type,
                 'petOwnerId': pet_owner_id}

    # update last login depending on the time of getting user info
    user.last_login = datetime.datetime.now()
    db.session.commit()

    return jsonify({'user': user_data})


@user_bp.route('', methods=['GET'])
@token_required
def get_all_users(current_user):
    if not current_user.admin:
        return jsonify({'message': 'Cannot perform that function!'})

    users = User.query.all()

    output = []

    for user in users:
        user_data = {'public_id': user.public_id, 'name': user.name, 'password': user.password, 'admin': user.admin}
        output.append(user_data)

    return jsonify({'users': output})


# get clinic profile
@user_bp.route('/clinic', methods=['GET'])
@token_required
def get_clinic_profile(current_user):
    clinic = Clinic.query.filter_by(user_id=current_user.uid).first()

    if not clinic:
        return jsonify({'message': 'No clinic found!'})

    animal_types = []
    for animal_type in clinic.animal_types:
        animal_types.append(animal_type.name)

    opening_hours = []
    for opening_hours_data in clinic.opening_hours:
        opening_hours.append({'dayOfWeek': opening_hours_data.day_of_week,
                              'startTime': opening_hours_data.start_time,
                              'breakStartTime': opening_hours_data.break_start_time,
                              'breakEndTime': opening_hours_data.break_end_time,
                              'endTime': opening_hours_data.end_time})

    clinic_data = {'id': clinic.id,
                   'name': clinic.name,
                   'address': clinic.address,
                   'phone': clinic.phone,
                   'contactEmail': clinic.contact_email,
                   'animalTypes': animal_types,
                   'openingHours': opening_hours}

    return jsonify({'clinic': clinic_data})


# update clinic profile
@user_bp.route('/clinic', methods=['PUT'])
@token_required
def change_clinic_detail(current_user):
    clinic = Clinic.query.filter_by(user_id=current_user.uid).first()

    if not clinic:
        return jsonify({'message': 'No user found!'})

    data = request.get_json()

    if data['name']:
        clinic.name = data['name']
    if data['address']:
        clinic.address = data['address']
    if data['phone']:
        clinic.phone = data['phone']
    if data['contactEmail']:
        clinic.contact_email = data['contactEmail']
    # search for animal types from input and append
    if data['animalTypes']:
        clinic.animal_types = []
        for animal_type_name in data['animalTypes']:
            animal_type = find_animal_type(animal_type_name)
            clinic.animal_types.append(animal_type)
    # opening hours, if input for the day empty, treat as closed on that day
    if data['openingHours']:
        # Monday is 0, Tuesday is 1 etc.
        for index, week_of_day_input in enumerate(data['openingHours']):
            if week_of_day_input:
                opening_hours = find_opening_hours(clinic.id, index)
                if "startTime" in week_of_day_input:
                    opening_hours.start_time = week_of_day_input['startTime']
                if "breakStartTime" in week_of_day_input:
                    opening_hours.break_start_time = week_of_day_input['breakStartTime']
                if "breakEndTime" in week_of_day_input:
                    opening_hours.break_end_time = week_of_day_input['breakEndTime']
                if "endTime" in week_of_day_input:
                    opening_hours.end_time = week_of_day_input['endTime']

    db.session.commit()

    return jsonify({'message': 'Clinic detail has been updated'})


@user_bp.route('/<public_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, public_id):
    if not current_user.admin:
        return jsonify({'message': 'Cannot perform that function!'})

    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message': 'No user found!'})

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'The user has been deleted!'})
