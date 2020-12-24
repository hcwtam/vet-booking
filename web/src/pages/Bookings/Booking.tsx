import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userContext } from '../../store/user';
import { BookingType } from '../../types/types';

const getBookingDataById = (bookingsData: BookingType[], id: string) => {
  if (isNaN(+id)) return null;
  return bookingsData.find((bookingData) => bookingData.id === +id);
};

export default function Booking(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const [{ bookings }] = useContext(userContext);
  const [bookingData, setBookingData] = useState<BookingType | null>(null);

  useEffect(() => {
    if (bookings.length) {
      let data = getBookingDataById(bookings, id);
      if (data) setBookingData(data);
    }
  }, [bookings, id]);

  return <pre>{JSON.stringify(bookingData)}</pre>;
}
