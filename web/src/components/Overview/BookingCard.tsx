import { SelectOutlined } from '@ant-design/icons';
import moment from 'moment';
import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { TIMEZONE_IN_MILLISECONDS } from '../../constants';
import { userContext } from '../../store/user';
import { BookingType } from '../../types/types';

interface Props {
  booking: BookingType;
}

const Card = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #ffffff;
  width: 98%;
  height: 90px;
  margin: 0 20px 40px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 8px #dfdfdf;
  transition: 0.1s;

  &:hover {
    color: #ff6600;
    box-shadow: 0 0 5px #ff6600;
  }
`;

const Date = styled.div`
  color: #666666;
  line-height: 1.3;
  h2 {
    font-size: 1.2rem;
    color: #000;
    margin: 0;
  }
`;

const CardItem = styled.div`
  color: #666666;
  line-height: 1.3;
  h2 {
    font-size: 1.2rem;
    color: #000;
    margin: 0;
  }

  @media (max-width: 750px) {
    display: none;
  }
`;

const Icon = styled.div`
  font-size: 1.4rem;
  transition: 0.1s;
  &:hover {
    transform: scale(1.1);
  }
`;

const DateSeperation = styled.div`
  border-right: 2px solid rgb(221, 221, 221);
  display: block;
  width: 2px;
  height: 48px;
`;
const Seperation = styled.div`
  border-right: 2px solid rgb(221, 221, 221);
  display: block;
  width: 2px;
  height: 48px;
  @media (max-width: 750px) {
    display: none;
  }
`;

export default function BookingCard({ booking }: Props): ReactElement {
  const [{ pets }] = useContext(userContext);
  const { startTime, petId, vetLastName } = booking;
  const history = useHistory();
  let pet;
  if (pets) {
    pet = pets.find((item) => item.id === petId);
  }
  let date, time;
  if (startTime) {
    const adjustedStartTime = +startTime + TIMEZONE_IN_MILLISECONDS;
    date = moment(adjustedStartTime).format('LL');
    time = moment(adjustedStartTime).format('LT');
  }
  return (
    <Card onClick={() => history.push(`/bookings/${booking.id}`)}>
      <Date>
        <h2>{date}</h2> {time}
      </Date>
      <DateSeperation />
      <CardItem>
        Patient:
        <h2>{pet?.name ? pet?.name : pet?.animalType}</h2>
      </CardItem>
      <Seperation />
      <CardItem>
        Vet:
        <h2>Dr. {vetLastName}</h2>
      </CardItem>
      <Seperation />
      <Icon>
        <SelectOutlined />
      </Icon>
    </Card>
  );
}
