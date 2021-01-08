import React, { ReactElement, useContext } from 'react';
import styled from 'styled-components';
import GuestBooking from '../components/Bookings/GuestBooking';
import { userContext } from '../store/user';
import { Timeline } from 'antd';
import BookingCard from '../components/Overview/BookingCard';

const Container = styled.div`
  width: 100%;
`;

export default function Home(): ReactElement {
  const [{ user, bookings }] = useContext(userContext);

  let bookingsData;
  if (bookings.length)
    bookingsData = bookings.map((booking) => (
      <Timeline.Item key={booking.id}>
        <BookingCard booking={booking} />
      </Timeline.Item>
    ));
  return user.userType ? (
    <>
      {bookings.length ? (
        <Timeline>
          <h1>My Appointments</h1>
          {bookingsData}
        </Timeline>
      ) : (
        <></>
      )}
    </>
  ) : (
    <Container>
      <GuestBooking />
    </Container>
  );
}
