import { Button, Descriptions } from 'antd';
import moment from 'moment';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Cancel from '../../components/Bookings/Cancel';
import Change from '../../components/Bookings/Change';
import BackButton from '../../components/UI/BackButton';
import Content from '../../components/UI/Content';
import { userContext } from '../../store/user';
import { BookingType, PetType } from '../../types/types';

const Info = styled.div`
  min-width: 60px;
`;

const ButtonGroup = styled.div`
  margin-top: 40px;
`;

const getBookingDataById = (bookingsData: BookingType[], id: string) => {
  if (isNaN(+id)) return null;
  return bookingsData.find((bookingData) => bookingData.id === +id);
};

export default function Booking(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const [{ bookings, pets }, { bookingsMutate }] = useContext(userContext);
  const [petData, setPetData] = useState<PetType | null | undefined>(null);
  const [bookingData, setBookingData] = useState<BookingType | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [, setIsCancelVisible] = useState<boolean>(false);
  const [, setShowDeleteOption] = useState<boolean>(false);

  useEffect(() => {
    if (bookings.length) {
      let data = getBookingDataById(bookings, id);
      if (data) setBookingData(data);
      if (pets) setPetData(pets.find((item) => item.id === bookingData?.petId));
    }
  }, [bookings, id, pets, bookingData]);

  return (
    <>
      <Content>
        <Descriptions title="Appointment Details" bordered>
          <Descriptions.Item label="Date">
            <Info>
              {moment
                .unix(+(bookingData?.startTime as string) / 1000)
                .format('LL')}
            </Info>
          </Descriptions.Item>
          <Descriptions.Item label="Time">
            <Info>
              {moment
                .unix(+(bookingData?.startTime as string) / 1000)
                .format('LT')}{' '}
            </Info>
          </Descriptions.Item>
          <Descriptions.Item label="Patient">
            <Info>{petData?.name} </Info>
          </Descriptions.Item>
          <Descriptions.Item label="Clinic">
            <Info>{bookingData?.clinicName} </Info>
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            <Info>{bookingData?.clinicAddress} </Info>
          </Descriptions.Item>
          <Descriptions.Item label="Vet">
            <Info>
              {bookingData?.vetFirstName} {bookingData?.vetLastName}{' '}
            </Info>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Info>{bookingData?.email} </Info>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <Info>{bookingData?.phone} </Info>
          </Descriptions.Item>
        </Descriptions>
        {+(bookingData?.startTime as string) > +new Date() ? (
          <ButtonGroup>
            <Button
              size="large"
              style={{ marginRight: 10 }}
              onClick={() => setIsVisible(true)}
            >
              Change Appointment Time
            </Button>
            <Cancel
              onCloseModal={() => setIsCancelVisible(false)}
              hidePopconfirm={() => setShowDeleteOption(false)}
              id={id}
              bookingsMutate={bookingsMutate}
            >
              <Button
                size="large"
                style={{ marginRight: 10 }}
                onClick={() => setShowDeleteOption(true)}
              >
                Cancel booking
              </Button>
            </Cancel>
          </ButtonGroup>
        ) : null}

        {bookingData ? (
          <Change
            isVisible={isVisible}
            onCloseModal={() => setIsVisible(false)}
            time={bookingData.startTime as string}
            id={id}
            bookingsMutate={bookingsMutate}
          />
        ) : null}
      </Content>
      <BackButton />
    </>
  );
}
