import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { authContext } from '../../store/auth';
import { VetChangeForm, changeVetInfo } from '../../utils/user';

interface Prop {
  firstName: string;
  lastName: string;
  id: string;
  vetsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function Change({
  firstName,
  lastName,
  id,
  vetsMutate
}: Prop): ReactElement {
  const { token } = useContext(authContext);

  const initialValues = {
    firstName,
    lastName
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required')
  });

  const onSubmit = async (values: VetChangeForm) => {
    console.log('Settings data', values);
    await changeVetInfo(values, id, token as string);
    vetsMutate();
  };

  return (
    <>
      <div>
        <h1>Change vet information</h1>
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
                  label="first name"
                  name="firstName"
                  placeholder="first name"
                />
                <Field
                  type="text"
                  label="last name"
                  name="lastName"
                  placeholder="last name"
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
