import React, { ReactElement, useContext, useState } from 'react';
import styled from 'styled-components';
import { userContext } from '../store/user';
import { Button, Timeline } from 'antd';
import BookingCard from '../components/Overview/BookingCard';
import Content from '../components/UI/Content';
import { TIMEZONE_IN_MILLISECONDS } from '../constants';

const CardContainer = styled.div`
  width: 100%;
  margin: 20px 2px 2px;
  border-radius: 5px;
  background-color: #efefef;
  box-shadow: 0 0 8px #ccc;
`;

const TimelineContainer = styled.div`
  width: 100%;
  padding: 40px;
`;

const Title = styled.div`
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 20px;
`;

const CURRENT_TIME = +new Date() + TIMEZONE_IN_MILLISECONDS;

export default function Home(): ReactElement {
  const [{ user, bookings }] = useContext(userContext);
  const [showUpcoming, setShowUpcoming] = useState<boolean>(true);

  let bookingsData;
  if (bookings.length) {
    const bookingsArray = bookings
      // sort bookings from old to new
      .sort((a, b) => +(a.startTime as string) - +(b.startTime as string))
      // show upcoming bookings if startTime greater than CURRENT_TIME, vice versa
      .filter((el) => {
        return showUpcoming
          ? +(el.startTime as string) > CURRENT_TIME
          : +(el.startTime as string) <= CURRENT_TIME;
      });

    bookingsData = bookingsArray.length ? (
      bookingsArray.map((booking, index) => (
        <Timeline.Item
          key={booking.id}
          color={showUpcoming ? (index === 0 ? 'green' : 'blue') : 'gray'}
        >
          <BookingCard booking={booking} />
        </Timeline.Item>
      ))
    ) : (
      <div>There is no booking.</div>
    );
  }
  return (
    <>
      {bookings.length ? (
        <Content>
          <h3 style={{ marginBottom: 20, fontSize: '1.1rem', fontWeight: 600 }}>
            Hello, {user.firstName}!
          </h3>
          <div>
            <Button
              size="large"
              style={{ marginRight: 10 }}
              className={showUpcoming ? 'active' : ''}
              onClick={() => setShowUpcoming(true)}
            >
              Upcoming Appointments
            </Button>
            <Button
              size="large"
              className={showUpcoming ? '' : 'active'}
              onClick={() => setShowUpcoming(false)}
            >
              Past Appointments
            </Button>
          </div>
          <CardContainer>
            <Title>
              <h2
                style={{ marginBottom: 0, fontSize: '1.2rem', fontWeight: 600 }}
              >
                {showUpcoming ? 'Upcoming Appointments' : 'Past Appointments'}
              </h2>
            </Title>
            <TimelineContainer>
              <Timeline>{bookingsData}</Timeline>
            </TimelineContainer>
          </CardContainer>
        </Content>
      ) : (
        <Content>
          <h3 style={{ marginBottom: 20, fontSize: '1.1rem', fontWeight: 600 }}>
            Hello, {user.firstName}!
          </h3>
          <div> You have no appointments.</div>
        </Content>
      )}
    </>
  );
}
