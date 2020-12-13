import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { authContext } from '../../store/auth';
import { VetChangeForm, changeVetInfo } from '../../utils/user';
import { OpeningHoursType } from '../../store/user';

interface Prop {
  firstName: string;
  lastName: string;
  specialties: string[];
  schedule: OpeningHoursType[];
  id: string;
  vetsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function Change({
  firstName,
  lastName,
  specialties,
  schedule,
  id,
  vetsMutate
}: Prop): ReactElement {
  const { token } = useContext(authContext);

  const initialValues = {
    firstName,
    lastName,
    specialties,
    schedule
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    specialties: Yup.array(),
    schedule: Yup.array()
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
                <div role="group" aria-labelledby="checkbox-group">
                  Specialties:
                  {['dog', 'cat', 'rabbit', 'turtle'].map((animalType) => (
                    <label key={animalType}>
                      <Field
                        type="checkbox"
                        name="specialties"
                        value={animalType}
                        checked={formik.values.specialties.includes(animalType)}
                      />
                      {animalType}
                    </label>
                  ))}
                </div>
                <div role="group">
                  Working Hours:
                  {schedule
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                    .map(({ dayOfWeek }) => (
                      <div key={dayOfWeek}>
                        <label key={dayOfWeek}>
                          <h4>{`Weekday ${dayOfWeek}`}</h4>
                          start time
                          <Field
                            type="time"
                            name={`schedule.${dayOfWeek}.startTime`}
                          />
                          break start time
                          <Field
                            type="time"
                            name={`schedule.${dayOfWeek}.breakStartTime`}
                          />
                          break end time
                          <Field
                            type="time"
                            name={`schedule.${dayOfWeek}.breakEndTime`}
                          />
                          end time
                          <Field
                            type="time"
                            name={`schedule.${dayOfWeek}.endTime`}
                          />
                        </label>
                        <br />
                      </div>
                    ))}
                </div>
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
