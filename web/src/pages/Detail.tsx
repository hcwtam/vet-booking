import Avatar from 'antd/lib/avatar/avatar';
import React, { ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import { VetType } from '../types/types';
import { UserOutlined } from '@ant-design/icons';

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Content = styled.article`
  width: 60%;
  margin: 30px;
`;

const VetCard = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(221, 221, 221);
  padding: 10px 0;
`;

const Paragraph = styled.div`
  margin-bottom: 30px;
`;

const BookingCard = styled.div`
  width: 40%;
  max-width: 400px;
  height: 450px;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
  margin: 30px;
`;

export default function Detail(): ReactElement {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const datetime = params.get('datetime');
  const animalType = params.get('animalType');
  const vetId = params.get('vetId');
  const { data } = useSWR<{ data: { vets: VetType[] } }>(
    datetime && animalType && vetId
      ? [
          `vet/guest?datetime=${datetime}&animalType=${animalType}&vetId=${vetId}`
        ]
      : null
  );

  let vet;
  if (data && data.data.vets) vet = data.data.vets[0];

  useEffect(() => {
    if (!vetId || !datetime || !animalType) history.push('/');
  }, [animalType, datetime, history, vetId]);

  return (
    <Container>
      <Content>
        <VetCard>
          <h1
            style={{ fontWeight: 600 }}
          >{`Dr. ${vet?.firstName} ${vet?.lastName}`}</h1>
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
      <BookingCard></BookingCard>
    </Container>
  );
}
