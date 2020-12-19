import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { authContext } from '../../store/auth';
import { userContext } from '../../store/user';
import { DEFAULT_TIMETABLE, PHONE_REGEX } from '../../constants';
import { AddVetForm } from '../../types/forms';
import { addVet } from '../../utils/user';

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
    specialties: [],
    schedule: DEFAULT_TIMETABLE
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    phone: Yup.string().matches(PHONE_REGEX, 'Phone number is not valid'),
    clinicId: Yup.string().required('Required'),
    specialties: Yup.array(),
    schedule: Yup.array()
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
                <div role="group">
                  Opening Hours:
                  {[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                  ].map((dayOfWeek, index) => (
                    <div key={dayOfWeek}>
                      <label key={dayOfWeek}>
                        <h4>{dayOfWeek}</h4>
                        start time
                        <Field
                          type="time"
                          name={`schedule.${index}.startTime`}
                        />
                        break start time
                        <Field
                          type="time"
                          name={`schedule.${index}.breakStartTime`}
                        />
                        break end time
                        <Field
                          type="time"
                          name={`schedule.${index}.breakEndTime`}
                        />
                        end time
                        <Field type="time" name={`schedule.${index}.endTime`} />
                      </label>
                    </div>
                  ))}
                  <br />
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
