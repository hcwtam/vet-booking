import React, { ReactElement } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { signup, SignupFormData } from '../utils/auth';

export default function Signup(): ReactElement {
  const history = useHistory();

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
    console.log('Signup form data', values);
    signup(values);
    history.push('/');
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
      <div>
        Have an account?{`  `}
        <Link to="/login">Log in</Link>
      </div>
    </>
  );
}
