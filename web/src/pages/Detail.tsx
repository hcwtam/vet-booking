import Avatar from 'antd/lib/avatar/avatar';
import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import useSWR from 'swr';
import { VetType } from '../types/types';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import GuestBookModal from '../components/Bookings/GuestBookModal';
import { TIMEZONE_IN_MILLISECONDS } from '../constants';

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Content = styled.article`
  width: 60%;
  margin: 0 30px 30px;

  @media (max-width: 950px) {
    width: 100%;
  }
`;

const Name = styled.h1`
  font-weight: 600;

  @media (max-width: 950px) {
    margin-bottom: 0;
  }
`;

const VetCard = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(221, 221, 221);
  padding: 10px 0;

  @media (max-width: 950px) {
    padding: 30px 0;
  }
`;

const Paragraph = styled.div`
  margin-bottom: 30px;
`;

const BookingCard = styled.div`
  width: 40%;
  max-width: 400px;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
  margin: 30px;
  @media (max-width: 950px) {
    display: none;
  }
`;

const MobileBookingCard = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding: 40px 20px;
  background-color: #f5f5f5;
  border-top: 2px solid #dddddd;
  @media (max-width: 950px) {
    display: block;
  }
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

export default function Detail(): ReactElement {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const datetime = params.get('datetime');
  const animalType = params.get('animalType');
  const vetId = params.get('vetId');

  // for booking card
  let date, time;
  if (datetime) {
    const adjustedStartTime = +datetime + TIMEZONE_IN_MILLISECONDS;
    date = moment(adjustedStartTime).format('LL');
    time = moment(adjustedStartTime).format('LT');
  }

  const { data } = useSWR<{ data: { vet: VetType } }>(
    datetime && animalType && vetId ? [`vet/${vetId}`] : null
  );

  let vet;
  if (data && data.data.vet) vet = data.data.vet;

  useEffect(() => {
    if (!vetId || !datetime || !animalType) history.push('/');
  }, [animalType, datetime, history, vetId]);

  const submitButton = (
    <Button
      danger
      type="primary"
      size="large"
      onClick={() => setIsVisible(true)}
      loading={isVisible}
      style={{
        borderRadius: 8,
        width: '100%',
        height: 50,
        fontWeight: 600
      }}
    >
      Book now
    </Button>
  );

  return (
    <Container>
      <Content>
        <VetCard>
          <Name>{`Dr. ${vet?.firstName} ${vet?.lastName}`}</Name>
          <Avatar
            icon={<UserOutlined />}
            size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 64, xxl: 64 }}
          />
        </VetCard>
        <h2 style={{ fontWeight: 600, fontSize: '1rem', marginTop: 20 }}>
          About
        </h2>
        <Paragraph>{`Doctor ${vet?.firstName} ${vet?.lastName}, originally from Laois, Ireland, is a world-class orthopaedic-neuro veterinary surgeon and managing director of one of the largest veterinary referral centres in the UK, Fitzpatrick Referrals.`}</Paragraph>

        <Paragraph>{`${vet?.firstName} obtained his Bachelor of Veterinary Medicine from University College Dublin in 1990. Following scholarships at The University of Pennsylvania and The University of Ghent, he went on to complete the RCVS certificates in small animal orthopaedics and radiology.`}</Paragraph>

        <Paragraph>{`${vet?.firstName} has attained boarded specialist status by examination in both the USA and the UK, with the degrees of ACVSMR, American College of Veterinary Sports Medicine and Rehabilitation, and DSAS(Orth), the Diploma in Small Animal Surgery (Orthopaedics).`}</Paragraph>
        <Paragraph>
          {`In 2005 he opened Fitzpatrick Referrals, the UK’s pre-eminent and largest dedicated small animal orthopaedic and neuro-surgical facility in Surrey, employing over 250 veterinary professionals and comprising state of the art surgical, diagnostic and rehabilitation facilities.`}
        </Paragraph>
      </Content>
      <BookingCard>
        <h2
          style={{ fontWeight: 600 }}
        >{`Appointment with Dr. ${vet?.lastName}`}</h2>
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
            <BookingInfo>{vet?.clinic.address}</BookingInfo>
          </BookingItem>
          <BookingItem>
            <PhoneOutlined />
            <BookingInfo>{vet?.phone}</BookingInfo>
          </BookingItem>
        </BookingList>
        {submitButton}
      </BookingCard>
      <GuestBookModal
        isVisible={isVisible}
        onCloseModal={() => setIsVisible(false)}
        vetId={vetId as string}
        datetime={datetime as string}
        animalType={animalType as string}
      />
      <MobileBookingCard>{submitButton}</MobileBookingCard>
    </Container>
  );
}
