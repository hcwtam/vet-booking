import React, { ReactElement, useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { authContext } from '../../store/auth';
import { changePetInfo } from '../../utils/user';
import { PetChangeForm } from '../../types/forms';
import { Button, Modal, Result } from 'antd';
import styled from 'styled-components';

interface Prop {
  name: string;
  id: string;
  petsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
  onCloseModal: () => void;
  isVisible: boolean;
}

const Label = styled.label`
  font-weight: 600;
`;

export default function Change({
  name,
  id,
  petsMutate,
  onCloseModal,
  isVisible
}: Prop): ReactElement {
  const { token } = useContext(authContext);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const initialValues = {
    name
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required')
  });

  const onSubmit = async (values: PetChangeForm) => {
    const res = await changePetInfo(values, id, token as string);
    if (res) {
      setIsSuccessful(true);
      petsMutate();
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
          Change Pet Info
        </div>
      }
    >
      {!isSuccessful ? (
        <div>
          <Label>Name</Label>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <Field
                    type="text"
                    label="name"
                    name="name"
                    placeholder="name"
                    className="ant-input"
                  />
                  <Button
                    danger
                    type="primary"
                    size="large"
                    htmlType="submit"
                    style={{
                      borderRadius: 8,
                      width: '100%',
                      height: 50,
                      fontWeight: 600,
                      marginTop: 20,
                      marginBottom: 20
                    }}
                    disabled={
                      !formik.dirty || !formik.isValid || formik.isSubmitting
                    }
                  >
                    Submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      ) : (
        <Result
          status="success"
          title="Success!"
          subTitle="You have Successfully changed pet information."
        />
      )}
    </Modal>
  );
}
