import React, { ReactElement, useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { signup, SignupFormData } from '../utils/auth';
import { authContext } from '../store/auth';

export default function Signup(): ReactElement {
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
        <h1>Vet Booking</h1>
        <h2>Sign up to start simple vet booking.</h2>
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
                  label="First name"
                  name="firstName"
                  placeholder="First Name"
                />
                <Field
                  type="text"
                  label="Last name"
                  name="lastName"
                  placeholder="Last Name"
                />
                <Field
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="Email"
                />
                <Field
                  type="text"
                  label="Username"
                  name="username"
                  placeholder="Username"
                />
                <Field
                  type="password"
                  label="Password"
                  name="password"
                  placeholder="Password"
                />
                <button
                  type="submit"
                  disabled={
                    !formik.dirty || !formik.isValid || formik.isSubmitting
                  }
                >
                  Sign up
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div>{errorMessage}</div>
      <div>
        Have an account?{`  `}
        <Link to="/login">Log in</Link>
      </div>
      <br />
      <Link to="/clinicsignup">Sign up for clinic</Link>
    </>
  );
}
