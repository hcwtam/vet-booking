import React, { ReactElement, useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { signup, SignupFormData } from '../../utils/auth';
import { authContext } from '../../store/auth';
import AntError from '../UI/AntError';
import { Button } from 'antd';
import { ModalContentType } from '../../types/types';
import LinkButton from '../UI/LinkButton';

interface Props {
  setModalContent: (content: ModalContentType) => void;
}

const Label = styled.label`
  font-weight: 600;
`;

export default function Signup({ setModalContent }: Props): ReactElement {
  const history = useHistory();
  const { setToken, setUserType } = useContext(authContext);

  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    userType: 'owner'
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    userType: Yup.string().required('Required')
  });

  const onSubmit = async (values: SignupFormData) => {
    const res = await signup(values);
    if (res.userType && res.token) {
      setToken(res.token);
      setUserType(res.userType);
      history.push('/profile');
    } else {
      setErrorMessage(
        res.error === 401
          ? 'Incorrect username or password.'
          : 'Cannot login. Please try again.'
      );
    }
  };

  return (
    <>
      <div>
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
                  placeholder="First Name"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <AntError name="firstName" />
                <Label>Last name</Label>
                <Field
                  type="text"
                  label="Last name"
                  name="lastName"
                  placeholder="Last Name"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <AntError name="lastName" />
                <Label>Email</Label>
                <Field
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="Email"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <AntError name="email" />
                <Label>Username</Label>
                <Field
                  type="text"
                  label="Username"
                  name="username"
                  placeholder="Username"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <AntError name="username" />
                <Label>Password</Label>
                <Field
                  type="password"
                  label="Password"
                  name="password"
                  placeholder="Password"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <AntError name="password" />
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
                    marginTop: 20,
                    marginBottom: 20
                  }}
                  disabled={
                    !formik.dirty || !formik.isValid || formik.isSubmitting
                  }
                >
                  Sign Up
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div>{errorMessage}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          Have an account?{`  `}
          <LinkButton onClick={() => setModalContent('Login')}>
            Login
          </LinkButton>
        </div>
        <LinkButton onClick={() => setModalContent('Sign up (clinic)')}>
          Sign up for clinic
        </LinkButton>
      </div>
    </>
  );
}
