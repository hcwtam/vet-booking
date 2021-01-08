import { Button, Form, Modal, Result } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { PHONE_REGEX } from '../../constants';
import { postBooking } from '../../utils/booking';

interface Props {
  isVisible: boolean;
  onCloseModal: () => void;
  vetId: string;
  datetime: string;
  animalType: string;
}

type GuestBookingType = {
  email: string;
  phone: string;
};

const Label = styled.label`
  font-weight: 600;
`;

export default function GuestBookModal({
  isVisible,
  onCloseModal,
  vetId,
  datetime,
  animalType
}: Props): ReactElement {
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const history = useHistory();

  const onSubmit = async (values: GuestBookingType) => {
    const data = { ...values, vetId: +vetId, datetime: +datetime, animalType };
    const res = await postBooking(data);
    if (res) {
      setIsSuccessful(true);
      localStorage.setItem('guestEmail', values.email);
      localStorage.setItem('guestPhone', values.phone);
    }
  };

  const onCancel = () => {
    onCloseModal();
    if (isSuccessful) history.push('/continue');
  };

  const initialValues = {
    email: '',
    phone: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    phone: Yup.string()
      .matches(PHONE_REGEX, 'Phone number is not valid')
      .required('Required')
  });

  return (
    <Modal
      visible={isVisible}
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
          Confirm Booking
        </div>
      }
      onCancel={onCancel}
      footer={[]}
    >
      {!isSuccessful ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <Label>Email</Label>
                <Field
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="Email"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <ErrorMessage
                  className="ant-form-item-explain ant-form-item-explain-error"
                  name="email"
                >
                  {(msg) => (
                    <div
                      className="ant-form-item-explain ant-form-item-explain-error"
                      role="alert"
                      style={{ position: 'relative', bottom: 12, height: 0 }}
                    >
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
                <Label>Phone Number</Label>
                <Field
                  type="text"
                  label="Phone"
                  name="phone"
                  placeholder="Phone number"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <ErrorMessage name="phone">
                  {(msg) => (
                    <div
                      className="ant-form-item-explain ant-form-item-explain-error"
                      role="alert"
                      style={{ position: 'relative', bottom: 12, height: 0 }}
                    >
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
                <Button
                  danger
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    borderRadius: 8,
                    width: '100%',
                    height: 50,
                    fontWeight: 600,
                    marginTop: 20
                  }}
                  onClick={() => onSubmit(formik.values)}
                  disabled={
                    !formik.dirty || !formik.isValid || formik.isSubmitting
                  }
                >
                  Confirm
                </Button>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <Result
          status="success"
          title="Successfully Booked!"
          subTitle="A booking summary has been sent to your email."
        />
      )}
    </Modal>
  );
}
