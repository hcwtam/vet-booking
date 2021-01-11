import React, { ReactElement, useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, Result, Steps } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { authContext } from '../../store/auth';
import { postBooking } from '../../utils/booking';
import { userContext } from '../../store/user';
import useSWR from 'swr';
import { PetType, VetType } from '../../types/types';
import Content from '../../components/UI/Content';
import { CatIcon, DogIcon, RabbitIcon, TurtleIcon } from '../../assets/Icons';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import VetCard from '../../components/Search/VetCard';
import moment from 'moment';

const CardContainer = styled.div`
  width: 100%;
  margin: 20px 2px 2px;
  border-radius: 5px;
  background-color: #efefef;
  box-shadow: 0 0 8px #ccc;
  padding: 10px;
`;

const PetIconsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PetIcon = styled.div`
  width: 120px;
  height: 140px;
  margin: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 8px #ccc;
  color: #444;
  transition: 0.1s;
  padding-bottom: 10px;
  &:hover {
    transform: scale(1.05);
    color: #ff7a22;
    box-shadow: 0 0 8px #ff6600;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0;
    color: inherit;
  }
`;

const Title = styled.div`
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 20px;
`;

const DatepickerContainer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const BookingCard = styled.div`
  width: 95%;
  max-width: 500px;
  margin: 10px auto;
  background-color: #fff;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
`;

const BookingList = styled.ul`
  padding: 0 10px;
  list-style: none;
`;

const BookingItem = styled.li`
  margin: 40px 0;
  font-size: 1.1rem;
`;

const BookingInfo = styled.span`
  margin-left: 30px;
`;

const TOMORROW_9_AM = new Date();
TOMORROW_9_AM.setDate(TOMORROW_9_AM.getDate() + 1);
TOMORROW_9_AM.setHours(9, 0, 0, 0);

export default function Bookings(): ReactElement {
  const { push } = useHistory();
  const { token } = useContext(authContext);
  const [{ pets }, { bookingsMutate }] = useContext(userContext);

  const [datetime, setDatetime] = useState<Date | null>(null);

  const [chosenVet, setChosenVet] = useState<VetType | null>(null);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [chosenPet, setChosenPet] = useState<PetType | null>(null);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const { data: searchedVetsData } = useSWR(
    // Search after user selected pet and date
    datetime && chosenPet
      ? [`vet/guest?datetime=${+datetime}&animalType=${chosenPet.animalType}`]
      : null
  );

  let weekday: number | null = null,
    date,
    time;
  if (datetime) {
    weekday = new Date(+datetime).getDay();
    date = moment.unix(+datetime / 1000).format('LL');
    time = moment.unix(+datetime / 1000).format('LT');
  }

  const { Step } = Steps;
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const back = () => {
    setCurrent(current - 1);
  };

  const handleDateChange = (date: Date) => {
    setDatetime(date);
  };

  const confirmBooking = async () => {
    const values = {
      datetime: datetime?.getTime(),
      petId: chosenPet?.id as number,
      vetId: chosenVet?.id as number,
      clinicId: clinicId as string
    };
    await postBooking(values, token as string);
  };

  let petsData;
  if (pets)
    petsData = pets.map((pet) => {
      let icon;
      switch (pet.animalType) {
        case 'cat':
          icon = <CatIcon />;
          break;
        case 'dog':
          icon = <DogIcon />;
          break;
        case 'rabbit':
          icon = <RabbitIcon />;
          break;
        case 'turtle':
          icon = <TurtleIcon />;
          break;

        default:
          break;
      }
      return (
        <PetIcon
          key={pet.id}
          onClick={() => {
            setChosenPet(pet);
            next();
          }}
        >
          <h2>{pet.name}</h2>
          {icon}
        </PetIcon>
      );
    });

  let vets;
  if (searchedVetsData) {
    vets = searchedVetsData.data.vets as VetType[];
  }

  let stepContent;
  if (current === 0)
    stepContent = (
      <>
        <Title>
          <h2 style={{ marginBottom: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            Select a pet
          </h2>
        </Title>
        <PetIconsContainer>
          {petsData}
          <PetIcon onClick={() => push('/pets/new')}>
            <h2>New Pet</h2>
            <PlusOutlined style={{ fontSize: '3rem' }} />
          </PetIcon>
        </PetIconsContainer>
      </>
    );
  if (current === 1)
    stepContent = (
      <>
        <Title>
          <h2 style={{ marginBottom: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            Select appointment date
          </h2>
        </Title>
        <DatepickerContainer>
          <DatePicker
            selected={datetime}
            onChange={(date) => handleDateChange(date as Date)}
            timeIntervals={15}
            showTimeSelect
            dateFormat="Pp"
            minDate={TOMORROW_9_AM}
            placeholderText="Select date"
            className="ant-input datepicker-input"
          />
          <Button
            size="large"
            shape="round"
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => next()}
            disabled={!datetime}
            loading={datetime !== null && !searchedVetsData}
          >
            Next
          </Button>
        </DatepickerContainer>
      </>
    );
  if (current === 2)
    stepContent = vets?.map((vet) => (
      <VetCard
        vet={vet}
        weekday={weekday as number}
        key={vet.id}
        userSelect={() => {
          setChosenVet(vet);
          setClinicId(vet.clinic.id);
          next();
        }}
      />
    ));
  if (current === 3)
    stepContent = (
      <BookingCard>
        <h2
          style={{ fontWeight: 600 }}
        >{`Appointment with Dr. ${chosenVet?.lastName}`}</h2>
        <BookingList>
          <BookingItem>
            <CalendarOutlined />
            <BookingInfo>{date}</BookingInfo>
          </BookingItem>
          <BookingItem>
            <ClockCircleOutlined />
            <BookingInfo>{time}</BookingInfo>
          </BookingItem>
          <BookingItem>
            <EnvironmentOutlined />
            <BookingInfo>{chosenVet?.clinic.address}</BookingInfo>
          </BookingItem>
          <BookingItem>
            <PhoneOutlined />
            <BookingInfo>{chosenVet?.phone}</BookingInfo>
          </BookingItem>
        </BookingList>
        <Button
          danger
          type="primary"
          size="large"
          onClick={async () => {
            await confirmBooking();
            bookingsMutate();
            setIsSuccessful(true);
          }}
          style={{
            borderRadius: 8,
            width: '100%',
            height: 50,
            fontWeight: 600
          }}
        >
          Confirm Booking
        </Button>
      </BookingCard>
    );

  return !isSuccessful ? (
    <Content>
      <h1>Make an appointment</h1>
      <Steps current={current}>
        <Step title="Select pet" />
        <Step title="Select date" />
        <Step title="Select vet" />
        <Step title="Confirm" />
      </Steps>
      <CardContainer>{stepContent}</CardContainer>
      {current > 0 ? (
        <Button size="large" style={{ marginTop: 30 }} onClick={() => back()}>
          Back
        </Button>
      ) : null}
    </Content>
  ) : (
    <Content>
      <Result
        status="success"
        title="Successfully Booked!"
        subTitle="You may be contacted by clinic staffs for details of the appointment."
      />
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Button size="large" onClick={() => push('/')}>
          Back to home
        </Button>
      </div>
    </Content>
  );
}
