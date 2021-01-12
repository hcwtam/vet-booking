import { Button } from 'antd';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import AntError from '../components/UI/AntError';
import { signup, SignupFormData } from '../utils/auth';
import { authContext } from '../store/auth';
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 95%;
  max-width: 500px;
  margin: 50px auto;
`;

const Label = styled.label`
  font-weight: 600;
`;

const EMAIL = localStorage.getItem('guestEmail');
const PHONE = localStorage.getItem('guestPhone');

export default function ContinueRegister(): ReactElement {
  const history = useHistory();
  const { setToken, setUserType } = useContext(authContext);
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    firstName: '',
    lastName: '',
    email: EMAIL || '',
    phone: PHONE || '',
    username: '',
    password: '',
    userType: 'owner'
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    userType: Yup.string().required('Required')
  });

  const onSubmit = async (values: SignupFormData) => {
    const res = await signup(values);
    if (res.userType && res.token) {
      localStorage.removeItem('guestEmail');
      localStorage.removeItem('guestPhone');
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

  useEffect(() => {
    if (!EMAIL || !PHONE) history.push('/');
  }, [history]);

  return (
    <Container>
      <h1 style={{ marginBottom: 20 }}>
        Create an account to view, change or cancel your bookings
      </h1>
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
                disabled
              />
              <AntError name="email" />
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
      <div>{errorMessage}</div>
      <div>
        Not interested? Return to{`  `}
        <Link to="/">homepage</Link>
      </div>
    </Container>
  );
}
