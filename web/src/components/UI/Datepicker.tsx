import { DatePicker } from 'antd';
import moment from 'moment';
import React, { ReactElement } from 'react';

interface Props {
  handleDateChange: (date: Date) => void;
}

// helpers
function disabledDate(current: any) {
  // Can not select days before today and today
  return current && current <= moment().endOf('day');
}

const disabledMins: number[] = [];
for (let i = 0; i < 60; i++) {
  if (i !== 0 && i !== 15 && i !== 30 && i !== 45) disabledMins.push(i);
}

const disabledSecs: number[] = [];
for (let i = 0; i < 60; i++) {
  disabledSecs.push(i);
}

function disabledDateTime() {
  return {
    disabledMinutes: () => disabledMins,
    disabledSeconds: () => disabledSecs
  };
}

export default function Datepicker({ handleDateChange }: Props): ReactElement {
  return (
    <DatePicker
      bordered={false}
      disabledDate={disabledDate}
      disabledTime={disabledDateTime}
      showTime={{ defaultValue: moment('09:00:00', 'HH:mm:ss') }}
      showNow={false}
      showSecond={false}
      minuteStep={15}
      format={'YYYY-MM-DD h:mm a'}
      onChange={(moment) => {
        if (moment) {
          handleDateChange(moment.toDate() as Date);
        }
      }}
    />
  );
}
