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

export default function VetCard({ vet, weekday }: Props): ReactElement {
  const { firstName, lastName } = vet;

  return (
    <Card style={{ width: '90%', maxWidth: 700, marginTop: 10 }} hoverable>
      <Skeleton loading={false} avatar active>
        <Card.Meta
          avatar={
            <Avatar
              size={{ xs: 64, sm: 64, md: 128, lg: 128, xl: 128, xxl: 128 }}
              icon={<UserOutlined />}
            />
          }
          title={
            <span
              style={{ fontSize: '1.2rem', color: '#1d154c', fontWeight: 600 }}
            >{`Dr. ${firstName} ${lastName}`}</span>
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
              <Subtitle>Visting hours</Subtitle>
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
