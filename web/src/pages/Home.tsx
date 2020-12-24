import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router';
import { userContext } from '../store/user';

export default function Home(): ReactElement {
  const [{ user, bookings }] = useContext(userContext);
  const history = useHistory();

  let bookingsData;
  if (bookings.length)
    bookingsData = bookings.map((booking) => (
      <button
        key={booking.id}
        onClick={() => history.push(`/bookings/${booking.id}`)}
      >
        {new Date(booking.startTime as string).toLocaleString()}
      </button>
    ));
  return (
    <>
      <div>
        Welcome to Vet Booking System {user.userType && `for ${user.userType}`}
      </div>
      {bookings.length ? (
        <>
          <br />
          <h2>Upcoming Appointments:</h2>
          {bookingsData}
        </>
      ) : null}
    </>
  );
}
