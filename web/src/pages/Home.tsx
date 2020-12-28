import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import GuestBooking from '../components/Bookings/GuestBooking';
import { userContext } from '../store/user';

const Container = styled.div`
  width: 100%;
`;

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
    <Container>
      {user.userType ? null : <GuestBooking />}
      {bookings.length ? (
        <>
          <br />
          <h2>Upcoming Appointments:</h2>
          {bookingsData}
        </>
      ) : null}
    </Container>
  );
}
