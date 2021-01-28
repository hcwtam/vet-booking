import { Button, Modal, Result } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { TIMEZONE_IN_MILLISECONDS } from '../../constants';

import { authContext } from '../../store/auth';
import { changeBookingTime } from '../../utils/booking';

interface Prop {
  isVisible: boolean;
  onCloseModal: () => void;
  time: string;
  id: string;
  bookingsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  width: 100%;
  margin-bottom: 15px;
`;

export default function Change({
  isVisible,
  onCloseModal,
  time,
  id,
  bookingsMutate
}: Prop): ReactElement {
  const { token } = useContext(authContext);
  const [datetime, setDatetime] = useState<Date>(
    new Date(+time + TIMEZONE_IN_MILLISECONDS)
  );
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const onSubmit = async () => {
    const res = await changeBookingTime(
      { datetime: datetime.getTime() - TIMEZONE_IN_MILLISECONDS },
      id,
      token as string
    );
    if (res.data) {
      setIsSuccessful(true);
      bookingsMutate();
    } else {
      setError(true);
    }
  };

  return (
    <Modal
      visible={isVisible}
      onCancel={() => {
        onCloseModal();
        setIsSuccessful(false);
      }}
      footer={[]}
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
          Change Appointment Time
        </div>
      }
    >
      {!isSuccessful ? (
        <Form>
          <Label>Date</Label>
          <DatePicker
            selected={datetime}
            onChange={(date) => setDatetime(date as Date)}
            timeIntervals={15}
            showTimeSelect
            dateFormat="Pp"
            className="ant-input"
          />
          <br style={{ marginTop: 20 }} />
          {error ? (
            <div style={{ color: 'red' }}>
              Vet is unavailable at this time. Please select a new time.
            </div>
          ) : null}
          <Button
            danger
            type="primary"
            size="large"
            onClick={onSubmit}
            style={{
              borderRadius: 8,
              width: '100%',
              height: 50,
              fontWeight: 600,
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Confirm
          </Button>
        </Form>
      ) : (
        <Result
          status="success"
          title="Success!"
          subTitle="You have Successfully changed the time of the appointment."
        />
      )}
    </Modal>
  );
}
