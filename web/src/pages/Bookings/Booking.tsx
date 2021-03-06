import { Button, Descriptions } from 'antd';
import moment from 'moment';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Cancel from '../../components/Bookings/Cancel';
import Change from '../../components/Bookings/Change';
import BackButton from '../../components/UI/BackButton';
import Content from '../../components/UI/Content';
import { TIMEZONE_IN_MILLISECONDS } from '../../constants';
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

  const { Item } = Descriptions;

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
          <Item label="Date">
            <Info>
              {moment(
                +(bookingData?.startTime as string) + TIMEZONE_IN_MILLISECONDS
              ).format('LL')}
            </Info>
          </Item>
          <Item label="Time">
            <Info>
              {moment(
                +(bookingData?.startTime as string) + TIMEZONE_IN_MILLISECONDS
              ).format('LT')}{' '}
            </Info>
          </Item>
          <Item label="Patient">
            <Info>{petData?.name} </Info>
          </Item>
          <Item label="Clinic">
            <Info>{bookingData?.clinicName} </Info>
          </Item>
          <Item label="Address">
            <Info>{bookingData?.clinicAddress} </Info>
          </Item>
          <Item label="Vet">
            <Info>
              {bookingData?.vetFirstName} {bookingData?.vetLastName}{' '}
            </Info>
          </Item>
          <Item label="Email">
            <Info>{bookingData?.email} </Info>
          </Item>
          <Item label="Phone">
            <Info>{bookingData?.phone} </Info>
          </Item>
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
