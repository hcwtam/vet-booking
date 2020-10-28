import React, { ReactElement } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

type FormData = {
  email: string;
  fullName: string;
  password: string;
  username: string;
};

export default function Signup(): ReactElement {
  const history = useHistory();

  const initialValues = {
    email: '',
    fullName: '',
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    fullName: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required')
  });

  const onSubmit = async (values: FormData) => {
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
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="Email"
                />
                <Field
                  type="text"
                  label="Full name"
                  name="fullName"
                  placeholder="Full Name"
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
