import React, { ReactElement, useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router';
import 'react-datepicker/dist/react-datepicker.css';

import { authContext } from '../store/auth';
import { postBooking } from '../utils/booking';
import { userContext } from '../store/user';

const TOMORROW_9_AM = new Date();
TOMORROW_9_AM.setDate(TOMORROW_9_AM.getDate() + 1);
TOMORROW_9_AM.setHours(9, 0, 0, 0);

export default function Booking(): ReactElement {
  const history = useHistory();
  const { token } = useContext(authContext);
  const [{ pets }] = useContext(userContext);

  const [datetime, setDatetime] = useState<Date>(TOMORROW_9_AM);
  const [chosenPet, setChosenPet] = useState<number | null>(null);

  const handleDateChange = (date: Date) => {
    setDatetime(date);
  };

  const confirmBooking = () => {
    const values = { datetime, petId: chosenPet as number };
    postBooking(values, token as string);
    history.push('/profile');
  };

  let petsData;

  if (pets)
    petsData = pets.map(({ id, name }) => (
      <button key={id} onClick={() => setChosenPet(id)}>
        <h2>{name}</h2>
      </button>
    ));

  return (
    <div>
      <h1>Make an appointment</h1>
      <h2>1&#41; Select pet</h2>
      {petsData}
      <br />
      <h2>2&#41; Select date and time</h2>
      <DatePicker
        selected={datetime}
        onChange={(date) => handleDateChange(date as Date)}
        timeIntervals={15}
        showTimeSelect
        dateFormat="Pp"
      />
      <br />
      <button disabled={!chosenPet} onClick={confirmBooking}>
        confirm
      </button>
    </div>
  );
}
