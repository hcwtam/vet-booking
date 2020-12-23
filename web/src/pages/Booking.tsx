import React, { ReactElement, useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { authContext } from '../store/auth';
import { postBooking } from '../utils/booking';
import { userContext } from '../store/user';
import useSWR from 'swr';
import { VetType } from '../types/types';

const TOMORROW_9_AM = new Date();
TOMORROW_9_AM.setDate(TOMORROW_9_AM.getDate() + 1);
TOMORROW_9_AM.setHours(9, 0, 0, 0);

export default function Booking(): ReactElement {
  const { token } = useContext(authContext);
  const [{ pets }] = useContext(userContext);
  const { data } = useSWR(token ? ['vet/all', token] : null);

  const [datetime, setDatetime] = useState<Date>(TOMORROW_9_AM);
  const [chosenVet, setChosenVet] = useState<number | null>(null);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [chosenPet, setChosenPet] = useState<number | null>(null);

  const handleDateChange = (date: Date) => {
    setDatetime(date);
  };

  const confirmBooking = () => {
    const values = {
      datetime: datetime.getTime(),
      petId: chosenPet as number,
      vetId: chosenVet as number,
      clinicId: clinicId as string
    };
    postBooking(values, token as string);
  };

  let vets, vetsData;
  if (data) {
    vets = data.data.vets as VetType[];

    vetsData = vets.map(({ id, firstName, clinic }) => (
      <button
        key={id}
        onClick={() => {
          setChosenVet(id);
          setClinicId(clinic.id);
        }}
      >
        <h2>{firstName}</h2>
      </button>
    ));
  }

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
      <h2>1&#41; Select vet</h2>
      {vetsData}
      <br />
      <h2>2&#41; Select pet</h2>
      {petsData}
      <br />
      <h2>3&#41; Select date and time</h2>
      <DatePicker
        selected={datetime}
        onChange={(date) => handleDateChange(date as Date)}
        timeIntervals={15}
        showTimeSelect
        dateFormat="Pp"
      />
      <br />
      <button disabled={!chosenVet || !chosenPet} onClick={confirmBooking}>
        confirm
      </button>
    </div>
  );
}
