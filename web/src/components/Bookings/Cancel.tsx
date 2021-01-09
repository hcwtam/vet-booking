import { Modal, Popconfirm, Result } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import { useHistory } from 'react-router';

import { authContext } from '../../store/auth';
import { deleteBooking } from '../../utils/booking';

interface Props {
  onCloseModal: () => void;
  hidePopconfirm: () => void;
  id: string;
  bookingsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
  children: React.ReactNode;
}

export default function Cancel({
  onCloseModal,
  hidePopconfirm,
  id,
  bookingsMutate,
  children
}: Props): ReactElement {
  const { token } = useContext(authContext);
  const history = useHistory();
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  return (
    <>
      <Popconfirm
        title="Are you sure you want to cancel this booking?"
        onConfirm={async () => {
          const res = await deleteBooking(id, token as string);
          if (res) {
            bookingsMutate();
            setIsSuccessful(true);
          }
        }}
        onCancel={hidePopconfirm}
        okText="Yes"
        cancelText="No"
      >
        {children}
      </Popconfirm>
      <Modal
        visible={isSuccessful}
        onCancel={() => {
          onCloseModal();
          history.push('/');
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
            Cancel Appointment
          </div>
        }
      >
        <Result
          status="success"
          title="Success!"
          subTitle="You have Successfully cancelled the appointment."
        />
      </Modal>
    </>
  );
}
