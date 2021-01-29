import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { VetType } from '../../types/types';

interface Props {
  showModal: boolean;
  onCancel: () => void;
  vet: VetType;
  userSelect: () => void;
}

const Content = styled.article`
  margin: 0 30px 30px;
`;

const Paragraph = styled.div`
  margin-bottom: 30px;
`;

export default function VetDetailModal({
  showModal,
  onCancel,
  vet,
  userSelect
}: Props): ReactElement {
  return (
    <Modal
      visible={showModal}
      width={'90vw'}
      bodyStyle={{ height: '70vh', overflowY: 'scroll' }}
      centered
      title={
        <div
          style={{
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            fontSize: 18
          }}
        >
          Vet Detail
        </div>
      }
      onCancel={onCancel}
      footer={[]}
    >
      {' '}
      <Content>
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{ fontWeight: 600 }}
          >{`Dr. ${vet?.firstName} ${vet?.lastName}`}</h1>
          <Avatar
            icon={<UserOutlined />}
            size={{ xs: 128, sm: 128, md: 128, lg: 128, xl: 128, xxl: 128 }}
          />
        </div>
        <h2 style={{ fontWeight: 600, fontSize: '1rem', marginTop: 20 }}>
          About
        </h2>
        <Paragraph>{`Doctor ${vet?.firstName} ${vet?.lastName}, originally from Laois, Ireland, is a world-class orthopaedic-neuro veterinary surgeon and managing director of one of the largest veterinary referral centres in the UK, Fitzpatrick Referrals.`}</Paragraph>

        <Paragraph>{`${vet?.firstName} obtained his Bachelor of Veterinary Medicine from University College Dublin in 1990. Following scholarships at The University of Pennsylvania and The University of Ghent, he went on to complete the RCVS certificates in small animal orthopaedics and radiology.`}</Paragraph>

        <Paragraph>{`${vet?.firstName} has attained boarded specialist status by examination in both the USA and the UK, with the degrees of ACVSMR, American College of Veterinary Sports Medicine and Rehabilitation, and DSAS(Orth), the Diploma in Small Animal Surgery (Orthopaedics).`}</Paragraph>
        <Paragraph>
          {`In 2005 he opened Fitzpatrick Referrals, the UK’s pre-eminent and largest dedicated small animal orthopaedic and neuro-surgical facility in Surrey, employing over 250 veterinary professionals and comprising state of the art surgical, diagnostic and rehabilitation facilities.`}
        </Paragraph>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button
            style={{ margin: '0 auto', maxWidth: 300, width: '90%' }}
            onClick={userSelect}
            size="large"
            shape="round"
            type="primary"
          >
            Select
          </Button>
        </div>
      </Content>
    </Modal>
  );
}
