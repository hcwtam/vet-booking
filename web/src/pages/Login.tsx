import React, { ReactElement, useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { login, LoginFormData } from '../utils/auth';
import { authContext } from '../store/auth';

export default function Login(): ReactElement {
  const history = useHistory();
  const { setToken, setUserType } = useContext(authContext);

  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required')
  });

  const onSubmit = async (values: LoginFormData) => {
    const res = await login(values);
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
                  Log In
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div>{errorMessage}</div>
      <div>
        Don't have an account?{`  `}
        <Link to="/signup">Sign up</Link>
      </div>
    </>
  );
}