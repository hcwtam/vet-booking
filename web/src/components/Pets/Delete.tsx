import { Modal, Popconfirm, Result } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { authContext } from '../../store/auth';
import { deletePet } from '../../utils/user';

interface Props {
  hide: () => void;
  id: string;
  petsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
  children: React.ReactNode;
  onCloseModal: () => void;
}

export default function Delete({
  hide,
  id,
  petsMutate,
  children,
  onCloseModal
}: Props): ReactElement {
  const { token } = useContext(authContext);
  const history = useHistory();
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  return (
    <>
      <Popconfirm
        title="Are you sure you want to delete this pet profile?"
        onConfirm={async () => {
          const res = await deletePet(id, token as string);
          if (res) {
            setIsSuccessful(true);
          }
        }}
        onCancel={hide}
        okText="Yes"
        cancelText="No"
      >
        {children}
      </Popconfirm>
      <Modal
        visible={isSuccessful}
        onCancel={() => {
          onCloseModal();
          petsMutate();
          history.push('/pets');
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
            Delete Pet
          </div>
        }
      >
        <Result
          status="success"
          title="Success!"
          subTitle="You have Successfully deleted this pet profile."
        />
      </Modal>
    </>
  );
}
