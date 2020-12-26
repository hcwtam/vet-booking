import React, { ReactElement, useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { authContext } from '../../store/auth';
import { changeBookingTime } from '../../utils/booking';

interface Prop {
  time: string;
  id: string;
  bookingsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function Change({
  time,
  id,
  bookingsMutate
}: Prop): ReactElement {
  const { token } = useContext(authContext);
  const [datetime, setDatetime] = useState<Date>(new Date(time));

  const onSubmit = async () => {
    await changeBookingTime(
      { datetime: datetime.getTime() },
      id,
      token as string
    );
    bookingsMutate();
  };

  return (
    <div>
      <DatePicker
        selected={datetime}
        onChange={(date) => setDatetime(date as Date)}
        timeIntervals={15}
        showTimeSelect
        dateFormat="Pp"
      />
      <br />
      <button type="submit" onClick={onSubmit}>
        confirm
      </button>
    </div>
  );
}
