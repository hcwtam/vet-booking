def get_weekday(date):
    # Monday is 1
    weekday = date.isoweekday()
    # Sunday is 7 in Python, 0 in JS
    if weekday == 7:
        weekday = 0
    return weekday


def check_vet_on_duty(scheduled_time, vet_working_hours):  # scheduled_time in Python datetime
    vet_start_hour = vet_working_hours.start_time[:2]
    vet_start_minute = vet_working_hours.start_time[3:]
    vet_break_start_hour = vet_working_hours.break_start_time[:2]
    vet_break_start_minute = vet_working_hours.break_start_time[3:]
    vet_break_end_hour = vet_working_hours.break_end_time[:2]
    vet_break_end_minute = vet_working_hours.break_end_time[3:]
    vet_end_hour = vet_working_hours.end_time[:2]
    vet_end_minute = vet_working_hours.end_time[3:]

    # compare in minutes
    vet_start_time = int(vet_start_hour) * 60 + int(vet_start_minute)
    vet_break_start_time = int(vet_break_start_hour) * 60 + int(vet_break_start_minute)
    vet_break_end_time = int(vet_break_end_hour) * 60 + int(vet_break_end_minute)
    vet_end_time = int(vet_end_hour) * 60 + int(vet_end_minute)

    booking_start_time = scheduled_time.hour * 60 + scheduled_time.minute
    booking_end_time = booking_start_time + 15

    if (vet_start_time <= booking_start_time and vet_break_start_time >= booking_end_time) or \
            (vet_break_end_time <= booking_start_time and vet_end_time >= booking_end_time):
        return True
    return False
