import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cancel from '../../components/Bookings/Cancel';
import Change from '../../components/Bookings/Change';
import { userContext } from '../../store/user';
import { BookingType } from '../../types/types';

const getBookingDataById = (bookingsData: BookingType[], id: string) => {
  if (isNaN(+id)) return null;
  return bookingsData.find((bookingData) => bookingData.id === +id);
};

export default function Booking(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const [{ bookings }, { bookingsMutate }] = useContext(userContext);
  const [bookingData, setBookingData] = useState<BookingType | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false);

  useEffect(() => {
    if (bookings.length) {
      let data = getBookingDataById(bookings, id);
      if (data) setBookingData(data);
    }
  }, [bookings, id]);

  return (
    <div>
      <pre>{JSON.stringify(bookingData)}</pre>;
      <button onClick={() => setShowForm(true)}>Change Appointment Time</button>
      {showForm && bookingData ? (
        <Change
          time={bookingData.startTime as string}
          id={id}
          bookingsMutate={bookingsMutate}
        />
      ) : null}
      <button onClick={() => setShowDeleteOption(true)}>Cancel booking</button>
      {showDeleteOption ? (
        <Cancel
          hide={() => setShowDeleteOption(false)}
          id={id}
          bookingsMutate={bookingsMutate}
        />
      ) : null}
    </div>
  );
}
