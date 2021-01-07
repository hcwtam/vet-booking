import { Modal } from 'antd';
import React, { ReactElement } from 'react';
import { ModalContentType } from '../../types/types';
import ClinicSignup from './ClinicSignup';
import Login from './Login';
import Signup from './Signup';

interface Props {
  showModal: boolean;
  hideModal: () => void;
  modalTitle: ModalContentType | null;
  setModalContent: (content: ModalContentType) => void;
}

export default function NavbarModal({
  showModal,
  hideModal,
  modalTitle,
  setModalContent
}: Props): ReactElement {
  const onCancel = () => {
    hideModal();
  };

  let modalContent = null;
  switch (modalTitle) {
    case 'Login':
      modalContent = <Login setModalContent={setModalContent} />;
      break;
    case 'Sign up':
      modalContent = <Signup setModalContent={setModalContent} />;
      break;
    case 'Sign up (clinic)':
      modalContent = <ClinicSignup setModalContent={setModalContent} />;
      break;

    default:
      break;
  }
  return (
    <Modal
      visible={showModal}
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
          {modalTitle}
        </div>
      }
      onCancel={onCancel}
      footer={[]}
    >
      {modalContent}
    </Modal>
  );
}
