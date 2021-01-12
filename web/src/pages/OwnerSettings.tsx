import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';

import { changeUserInfo } from '../utils/user';
import { authContext } from '../store/auth';
import { OwnerSettingsData } from '../types/forms';
import Content from '../components/UI/Content';

const Container = styled.div`
  width: 100%;
  border-radius: 5px;
  background-color: #efefef;
  box-shadow: 0 0 8px #ccc;
  padding: 0 0 20px;
`;

const FormContainer = styled.div`
  padding: 20px;
`;

const Title = styled.div`
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 20px;
`;

const Label = styled.label`
  font-weight: 600;
`;

export default function OwnerSettings(): ReactElement {
  const history = useHistory();
  const { token } = useContext(authContext);

  const initialValues = {
    firstName: '',
    lastName: ''
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required')
  });

  const onSubmit = async (values: OwnerSettingsData) => {
    await changeUserInfo(values, token as string);
    history.push('/profile');
  };

  return (
    <Content>
      <h1>Settings</h1>
      <Container>
        <Title>
          <h2 style={{ marginBottom: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            Change your user information
          </h2>
        </Title>
        <FormContainer>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <Label>First name</Label>
                  <Field
                    type="text"
                    label="First name"
                    name="firstName"
                    placeholder="First name"
                    className="ant-input"
                    style={{ marginBottom: 20 }}
                  />
                  <Label>Last name</Label>
                  <Field
                    type="text"
                    label="Last name"
                    name="lastName"
                    placeholder="Last name"
                    className="ant-input"
                    style={{ marginBottom: 20 }}
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
                      marginTop: 20
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
        </FormContainer>
      </Container>
    </Content>
  );
}
