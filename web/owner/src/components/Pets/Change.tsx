import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { authContext } from '../../store/auth';
import { PetChangeForm, changePetInfo } from '../../utils/user';

interface Prop {
  name: string;
  id: string;
  petsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function Change({ name, id, petsMutate }: Prop): ReactElement {
  const { token } = useContext(authContext);

  const initialValues = {
    name
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required')
  });

  const onSubmit = async (values: PetChangeForm) => {
    console.log('Settings data', values);
    await changePetInfo(values, id, token as string);
    petsMutate();
  };

  return (
    <>
      <div>
        <h1>Change pet information</h1>
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
                  label="name"
                  name="name"
                  placeholder="name"
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
