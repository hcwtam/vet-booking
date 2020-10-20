from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)

app.config['SECRET_KEY'] = 'thisissecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////mnt/c/Users/Wesley/desktop/portfolio ' \
                                        'projects/vet-booking/server/todo.db '

db = SQLAlchemy(app)


# Define database schema
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    user_type = db.Column(db.String(12), nullable=False)
    active = db.Column(db.Boolean)
    last_login = db.Column(db.DateTime)
    pet_owners = db.relationship('PetOwner', backref='user', lazy=True)
    vets = db.relationship('Vet', backref='user', lazy=True)
    staffs = db.relationship('Staff', backref='user', lazy=True)


class PetOwner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(120), unique=True)
    pets = db.relationship('Pet', backref='pet_owner', lazy=True)


class Vet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    clinic_id = db.Column(db.Integer, db.ForeignKey('clinic.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal_type.id'), nullable=False)
    bookings = db.relationship('Booking', backref='vet', lazy=True)


class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    clinic_id = db.Column(db.Integer, db.ForeignKey('clinic.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Clinic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(120), unique=True)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    opening_hours = db.Column(db.String(50), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal_type.id'), nullable=False)
    bookings = db.relationship('Booking', backref='clinic', lazy=True)
    staffs = db.relationship('Staff', backref='clinic', lazy=True)
    vets = db.relationship('Vet', backref='clinic', lazy=True)


class AnimalType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pets = db.relationship('Pet', backref='animal_type', lazy=True)
    clinics = db.relationship('Clinic', backref='animal_type', lazy=True)
    vets = db.relationship('Vet', backref='animal_type', lazy=True)


class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal_type.id'), nullable=False)
    last_login = db.Column(db.DateTime, nullable=False)
    gender = db.Column(db.String(6), nullable=False)
    illness_id = db.Column(db.Integer, db.ForeignKey('illness.id'), nullable=False)
    desexed = db.Column(db.Boolean, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('pet_owner.id'), nullable=False)
    bookings = db.relationship('Booking', backref='pet', lazy=True)


class Illness(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100))
    pets = db.relationship('Pet', backref='illness', lazy=True)


class Booking(db.Model):
    booking_number = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    time_slot_id = db.Column(db.Integer, db.ForeignKey('time_slot.id'), nullable=False)
    vet_id = db.Column(db.Integer, db.ForeignKey('vet.id'), nullable=False)
    clinic_id = db.Column(db.Integer, db.ForeignKey('clinic.id'), nullable=False)


class TimeSlot(db.Model):
    booking_number = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    booking = db.relationship('Booking', backref='time_slot', lazy=True)

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = None
#
#         if 'x-access-token' in request.headers:
#             token = request.headers['x-access-token']
#
#         if not token:
#             return jsonify({'message': 'Token is missing!'}), 401
#
#         try:
#             data = jwt.decode(token, app.config['SECRET_KEY'])
#             current_user = User.query.filter_by(public_id=data['public_id']).first()
#         except:
#             return jsonify({'message': 'Token is invalid!'}), 401
#
#         return f(current_user, *args, **kwargs)
#
#     return decorated
#
#
# @app.route('/user', methods=['GET'])
# @token_required
# def get_all_users(current_user):
#     if not current_user.admin:
#         return jsonify({'message': 'Cannot perform that function!'})
#
#     users = User.query.all()
#
#     output = []
#
#     for user in users:
#         user_data = {'public_id': user.public_id, 'name': user.name, 'password': user.password, 'admin': user.admin}
#         output.append(user_data)
#
#     return jsonify({'users': output})
#
#
# @app.route('/user/<public_id>', methods=['GET'])
# @token_required
# def get_one_user(current_user, public_id):
#     if not current_user.admin:
#         return jsonify({'message': 'Cannot perform that function!'})
#
#     user = User.query.filter_by(public_id=public_id).first()
#
#     if not user:
#         return jsonify({'message': 'No user found!'})
#
#     user_data = {'public_id': user.public_id, 'name': user.name, 'password': user.password, 'admin': user.admin}
#
#     return jsonify({'user': user_data})
#
#
# @app.route('/user', methods=['POST'])
# @token_required
# def create_user(current_user):
#     if not current_user.admin:
#         return jsonify({'message': 'Cannot perform that function!'})
#
#     data = request.get_json()
#
#     hashed_password = generate_password_hash(data['password'], method='sha256')
#
#     new_user = User(public_id=str(uuid.uuid4()), name=data['name'], password=hashed_password, admin=False)
#     db.session.add(new_user)
#     db.session.commit()
#
#     return jsonify({'message': 'New user created!'})
#
#
# @app.route('/user/<public_id>', methods=['PUT'])
# @token_required
# def promote_user(current_user, public_id):
#     if not current_user.admin:
#         return jsonify({'message': 'Cannot perform that function!'})
#
#     user = User.query.filter_by(public_id=public_id).first()
#
#     if not user:
#         return jsonify({'message': 'No user found!'})
#
#     user.admin = True
#     db.session.commit()
#
#     return jsonify({'message': 'The user has been promoted!'})
#
#
# @app.route('/user/<public_id>', methods=['DELETE'])
# @token_required
# def delete_user(current_user, public_id):
#     if not current_user.admin:
#         return jsonify({'message': 'Cannot perform that function!'})
#
#     user = User.query.filter_by(public_id=public_id).first()
#
#     if not user:
#         return jsonify({'message': 'No user found!'})
#
#     db.session.delete(user)
#     db.session.commit()
#
#     return jsonify({'message': 'The user has been deleted!'})
#
#
# @app.route('/login')
# def login():
#     auth = request.authorization
#
#     if not auth or not auth.username or not auth.password:
#         return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
#
#     user = User.query.filter_by(name=auth.username).first()
#
#     if not user:
#         return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
#
#     if check_password_hash(user.password, auth.password):
#         token = jwt.encode(
#             {'public_id': user.public_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
#             app.config['SECRET_KEY'])
#
#         return jsonify({'token': token.decode('UTF-8')})
#
#     return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
#
#
# @app.route('/todo', methods=['GET'])
# @token_required
# def get_all_todos(current_user):
#     todos = Todo.query.filter_by(user_id=current_user.id).all()
#
#     output = []
#
#     for todo in todos:
#         todo_data = {}
#         todo_data['id'] = todo.id
#         todo_data['text'] = todo.text
#         todo_data['complete'] = todo.complete
#         output.append(todo_data)
#
#     return jsonify({'todos': output})
#
#
# @app.route('/todo/<todo_id>', methods=['GET'])
# @token_required
# def get_one_todo(current_user, todo_id):
#     todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
#
#     if not todo:
#         return jsonify({'message': 'No todo found!'})
#
#     todo_data = {'id': todo.id, 'text': todo.text, 'complete': todo.complete}
#
#     return jsonify(todo_data)
#
#
# @app.route('/todo', methods=['POST'])
# @token_required
# def create_todo(current_user):
#     data = request.get_json()
#
#     new_todo = Todo(text=data['text'], complete=False, user_id=current_user.id)
#     db.session.add(new_todo)
#     db.session.commit()
#
#     return jsonify({'message': "Todo created!"})
#
#
# @app.route('/todo/<todo_id>', methods=['PUT'])
# @token_required
# def complete_todo(current_user, todo_id):
#     todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
#
#     if not todo:
#         return jsonify({'message': 'No todo found!'})
#
#     todo.complete = True
#     db.session.commit()
#
#     return jsonify({'message': 'Todo item has been completed!'})
#
#
# @app.route('/todo/<todo_id>', methods=['DELETE'])
# @token_required
# def delete_todo(current_user, todo_id):
#     todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
#
#     if not todo:
#         return jsonify({'message': 'No todo found!'})
#
#     db.session.delete(todo)
#     db.session.commit()
#
#     return jsonify({'message': 'Todo item deleted!'})


if __name__ == '__main__':
    app.run(debug=True)