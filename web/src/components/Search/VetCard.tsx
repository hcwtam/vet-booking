import { Button, Card, Skeleton } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import {
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import React, { ReactElement, useState } from 'react';
import { VetType } from '../../types/types';
import styled from 'styled-components';
import VetDetailModal from './VetDetailModal';

interface Props {
  vet: VetType;
  weekday: number | null;
  handleClick?: (() => void) | null;
  userSelect?: (() => void) | null;
  index: number;
}

const Title = styled.div`
  font-size: 1.2rem;
  color: #313131;
  font-weight: 600;
  display: flex;
  justify-content: space-between;

  @media (max-width: 550px) {
    flex-flow: column;
  }
`;

const SpecialtyList = styled.div`
  @media (max-width: 550px) {
    margin-left: -10px;
  }
`;

const MediaAvatar = styled.div`
  @media (max-width: 550px) {
    display: none;
  }
`;

const Subtitle = styled.div`
  color: #000000;
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const Description = styled.div`
  margin-bottom: 5px;
  display: flex;
  width: 100%;
`;

const Specialty = styled.span`
  margin-left: 10px;
  font-size: 0.9rem;
  color: #444444;
  border: 1px solid #444444;
  border-radius: 5px;
  font-weight: normal;
  padding: 1px 5px;
`;

export default function VetCard({
  vet,
  weekday,
  handleClick,
  userSelect = null,
  index
}: Props): ReactElement {
  const [showModal, setShowModal] = useState<boolean>(false);

  let specialties = null;
  if (vet.specialties && vet.specialties.length) {
    specialties = vet.specialties.map((specialty) => (
      <Specialty key={specialty}>{specialty}</Specialty>
    ));
  }

  return (
    <>
      <Card
        style={{
          width: '100%',
          display: 'absolute',
          backgroundColor: index % 2 === 0 ? '#fff8f5' : '#ffffff',
          borderTop: '1px solid #dddddd',
          borderBottom: '1px solid #dddddd'
        }}
        hoverable
        onClick={handleClick ? handleClick : () => setShowModal(true)}
      >
        <Skeleton loading={false} avatar active>
          <Card.Meta
            avatar={
              <MediaAvatar>
                <Avatar
                  size={{ xs: 0, sm: 0, md: 64, lg: 128, xl: 128, xxl: 128 }}
                  icon={<UserOutlined />}
                />
              </MediaAvatar>
            }
            title={
              <Title>
                {`Dr. ${vet.firstName} ${vet.lastName}`}
                <SpecialtyList>{specialties}</SpecialtyList>
              </Title>
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
        {userSelect ? (
          <>
            <Button
              size="middle"
              shape="round"
              style={{ position: 'absolute', right: 120, bottom: 30 }}
            >
              Detail
            </Button>
            <Button
              size="middle"
              shape="round"
              type="primary"
              style={{ position: 'absolute', right: 30, bottom: 30 }}
              onClick={userSelect}
            >
              Select
            </Button>
          </>
        ) : null}
      </Card>
      <VetDetailModal
        showModal={showModal}
        onCancel={() => setShowModal(false)}
        vet={vet}
        userSelect={userSelect as () => void}
      />
    </>
  );
}
