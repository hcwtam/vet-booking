import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { addPet, AddPetForm } from '../../utils/user';
import { authContext } from '../../store/auth';

interface Prop {
  petsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function AddPet({ petsMutate }: Prop): ReactElement {
  const { token } = useContext(authContext);

  const initialValues = {
    name: '',
    animalType: '',
    gender: '',
    desexed: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    animalType: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    desexed: Yup.string().required('Required')
  });

  const onSubmit = async (values: AddPetForm) => {
    await addPet(values, token as string);
    petsMutate();
  };

  return (
    <>
      <div>
        <h1>Add Pet</h1>
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
                <Field as="select" label="Animal Type" name="animalType">
                  <option value="">Type</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="turtle">Turtle</option>
                </Field>
                <Field as="select" label="Gender" name="gender">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Field>
                <Field as="select" label="Desexed" name="desexed">
                  <option value="">Desexed</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Field>
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
