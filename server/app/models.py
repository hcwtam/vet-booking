"""Data models."""
from . import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    user_type = db.Column(db.String(12), nullable=False)
    active = db.Column(db.Boolean)
    last_login = db.Column(db.DateTime)
    pet_owners = db.relationship('PetOwner', backref='user', lazy=True)
    vets = db.relationship('Vet', backref='user', lazy=True)
    staffs = db.relationship('Staff', backref='user', lazy=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)


class PetOwner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(120))
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


clinic_animalType = db.Table('clinic_animalType',
                             db.Column('clinic_id', db.Integer, db.ForeignKey('clinic.id')),
                             db.Column('animalType_id', db.Integer, db.ForeignKey('animal_type.id'))
                             )


class Clinic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(50))
    address = db.Column(db.String(120), unique=True)
    phone = db.Column(db.String(20))
    contact_email = db.Column(db.String(120), unique=True)
    opening_hours = db.Column(db.String(50))
    animal_types = db.relationship('AnimalType', secondary=clinic_animalType, backref='clinics', lazy=True)
    bookings = db.relationship('Booking', backref='clinic', lazy=True)
    staffs = db.relationship('Staff', backref='clinic', lazy=True)
    vets = db.relationship('Vet', backref='clinic', lazy=True)


class AnimalType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    pets = db.relationship('Pet', backref='animal_type', lazy=True)
    vets = db.relationship('Vet', backref='animal_type', lazy=True)


pet_illness = db.Table('pet_illness',
                       db.Column('pet_id', db.Integer, db.ForeignKey('pet.id')),
                       db.Column('illness_id', db.Integer, db.ForeignKey('illness.id'))
                       )


class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal_type.id'), nullable=False)
    birth_date = db.Column(db.DateTime)  # TODO
    gender = db.Column(db.String(6), nullable=False)
    desexed = db.Column(db.Boolean, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('pet_owner.id'), nullable=False)
    illnesses = db.relationship('Illness', secondary=pet_illness, backref='pets', lazy=True)
    bookings = db.relationship('Booking', backref='pet', lazy=True)

    def __repr__(self):
        return '<Pet {}>'.format(self.name)


class Illness(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(100))


class Booking(db.Model):
    booking_number = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    time_slot_id = db.Column(db.Integer, db.ForeignKey('time_slot.id'), nullable=False)
    vet_id = db.Column(db.Integer, db.ForeignKey('vet.id'), nullable=False)
    clinic_id = db.Column(db.Integer, db.ForeignKey('clinic.id'), nullable=False)


class TimeSlot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    booking = db.relationship('Booking', backref='time_slot', lazy=True)
