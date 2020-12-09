import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import { changeClinicInfo, SettingsData } from '../utils/user';
import { authContext } from '../store/auth';
import { userContext } from '../store/user';

const PHONE_REGEX = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default function Settings(): ReactElement {
  const history = useHistory();
  const { token } = useContext(authContext);

  const [, mutate] = useContext(userContext);
  const { clinicMutate } = mutate;

  const initialValues = {
    name: '',
    address: '',
    phone: '',
    contactEmail: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string(),
    address: Yup.string(),
    phone: Yup.string().matches(PHONE_REGEX, 'Phone number is not valid'),
    contactEmail: Yup.string().email('Invalid email format')
  });

  const onSubmit = async (values: SettingsData) => {
    console.log('Settings data', values);
    await changeClinicInfo(values, token as string);
    clinicMutate();
    history.push('/profile');
  };

  return (
    <>
      <div>
        <h1>Set clinic information</h1>
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
                  label="Name"
                  name="name"
                  placeholder="Name"
                />
                <Field
                  type="text"
                  label="Address"
                  name="address"
                  placeholder="Address"
                />
                <Field
                  type="text"
                  label="Phone"
                  name="phone"
                  placeholder="Phone number"
                />
                <Field
                  type="email"
                  label="Contact email"
                  name="contactEmail"
                  placeholder="Contact email"
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
