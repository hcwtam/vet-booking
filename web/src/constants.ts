import { OpeningHoursType } from './types/types';

export const PHONE_REGEX = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const DEFAULT_TIMETABLE: OpeningHoursType[] = [];
for (let i = 0; i < 7; i++) {
  DEFAULT_TIMETABLE.push({
    dayOfWeek: i,
    startTime: '09:00',
    breakStartTime: '13:00',
    breakEndTime: '14:00',
    endTime: '18:00'
  });
}

export const TIMEZONE_IN_MILLISECONDS =
  new Date().getTimezoneOffset() * 60 * 1000;
