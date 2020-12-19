import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import { changeUserInfo } from '../utils/user';
import { authContext } from '../store/auth';
import { OwnerSettingsData } from '../types/forms';

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
    <>
      <div>
        <h1>Change user information</h1>
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
                  placeholder="First name"
                />
                <Field
                  type="text"
                  label="Last name"
                  name="lastName"
                  placeholder="Last name"
                />
                <button
                  type="submit"
                  disabled={
                    !formik.dirty || !formik.isValid || formik.isSubmitting
                  }
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}
