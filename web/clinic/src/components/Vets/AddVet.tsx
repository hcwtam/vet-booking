import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { addVet, AddVetForm } from '../../utils/user';
import { authContext } from '../../store/auth';
import { userContext } from '../../store/user';
import { PHONE_REGEX } from '../../constants';

interface Prop {
  vetsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function AddVet({ vetsMutate }: Prop): ReactElement {
  const { token } = useContext(authContext);
  const [data] = useContext(userContext);
  const { clinic } = data;

  const initialValues = {
    firstName: '',
    lastName: '',
    phone: '',
    clinicId: clinic.id,
    specialties: []
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    phone: Yup.string().matches(PHONE_REGEX, 'Phone number is not valid'),
    clinicId: Yup.string().required('Required'),
    specialties: Yup.array()
  });

  const onSubmit = async (values: AddVetForm) => {
    await addVet(values, token as string);
    vetsMutate();
  };

  return (
    <>
      <div>
        <h1>Add Vet</h1>
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
                  label="First Name"
                  name="firstName"
                  placeholder="First Name"
                />
                <Field
                  type="text"
                  label="Last Name"
                  name="lastName"
                  placeholder="Last Name"
                />
                <Field
                  type="text"
                  label="Phone"
                  name="phone"
                  placeholder="Phone number"
                />
                <div role="group" aria-labelledby="checkbox-group">
                  Specialties:
                  <label>
                    <Field type="checkbox" name="specialties" value="dog" />
                    Dog
                  </label>
                  <label>
                    <Field type="checkbox" name="specialties" value="cat" />
                    Cat
                  </label>
                  <label>
                    <Field type="checkbox" name="specialties" value="rabbit" />
                    Rabbit
                  </label>
                  <label>
                    <Field type="checkbox" name="specialties" value="turtle" />
                    Turtle
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={
                    !formik.dirty || !formik.isValid || formik.isSubmitting
                  }
                >
                  Add
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}
