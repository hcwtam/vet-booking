from app import db
from app.models import AnimalType, VetSchedule


def find_specialty(animal_type_name):
    specialty = AnimalType.query.filter_by(name=animal_type_name).first()

    if not specialty:
        db.session.add(AnimalType(name=animal_type_name))
        specialty = AnimalType.query.filter_by(name=animal_type_name).first()

    return specialty


def find_vet_schedule(vet_id, weekday):
    working_hours = VetSchedule.query.filter_by(vet_id=vet_id, day_of_week=weekday).first()

    if not working_hours:
        db.session.add(VetSchedule(vet_id=vet_id, day_of_week=weekday))
        working_hours = VetSchedule.query.filter_by(vet_id=vet_id, day_of_week=weekday).first()

    return working_hours


def set_new_schedule(new_schedule, vet_id):
    # Monday is 0, Tuesday is 1 etc.
    for index, week_of_day_input in enumerate(new_schedule):
        if week_of_day_input:
            working_hours = find_vet_schedule(vet_id, index)
            if "startTime" in week_of_day_input:
                working_hours.start_time = week_of_day_input['startTime']
            if "breakStartTime" in week_of_day_input:
                working_hours.break_start_time = week_of_day_input['breakStartTime']
            if "breakEndTime" in week_of_day_input:
                working_hours.break_end_time = week_of_day_input['breakEndTime']
            if "endTime" in week_of_day_input:
                working_hours.end_time = week_of_day_input['endTime']
