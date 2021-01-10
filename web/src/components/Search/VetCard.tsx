import { Card, Skeleton } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import {
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import React, { ReactElement } from 'react';
import { VetType } from '../../types/types';
import styled from 'styled-components';

interface Props {
  vet: VetType;
  weekday: number | null;
  handleClick: () => void;
}

const Subtitle = styled.div`
  color: #1d154c;
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const Description = styled.div`
  margin-bottom: 5px;
`;

const Specialty = styled.span`
  margin-left: 10px;
  font-size: 0.9rem;
  color: #7e7e7e;
  border: 1px solid #7e7e7e;
  border-radius: 5px;
  font-weight: normal;
  padding: 1px 5px;
`;

export default function VetCard({
  vet,
  weekday,
  handleClick
}: Props): ReactElement {
  let specialties = null;
  if (vet.specialties && vet.specialties.length) {
    specialties = vet.specialties.map((specialty) => (
      <Specialty key={specialty}>{specialty}</Specialty>
    ));
  }

  return (
    <Card
      style={{ width: '100%', marginTop: 10 }}
      hoverable
      onClick={handleClick}
    >
      <Skeleton loading={false} avatar active>
        <Card.Meta
          avatar={
            <Avatar
              size={{ xs: 64, sm: 64, md: 128, lg: 128, xl: 128, xxl: 128 }}
              icon={<UserOutlined />}
            />
          }
          title={
            <div
              style={{
                fontSize: '1.2rem',
                color: '#1d154c',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              {`Dr. ${vet.firstName} ${vet.lastName}`}
              <div>{specialties}</div>
            </div>
          }
          description={
            <span>
              <Subtitle>Address</Subtitle>
              <Description>
                <Icon>
                  <EnvironmentOutlined />
                </Icon>
                {vet.clinic.address}
              </Description>
              <Subtitle>Visiting hours</Subtitle>
              <Description>
                <Icon>
                  <ClockCircleOutlined />
                </Icon>
                {`${vet.schedule[weekday as number].startTime} - ${
                  vet.schedule[weekday as number].endTime
                }`}
              </Description>
            </span>
          }
        />
      </Skeleton>
    </Card>
  );
}
