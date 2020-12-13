import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import { changeClinicInfo, SettingsData } from '../utils/user';
import { authContext } from '../store/auth';
import { OpeningHoursType, userContext } from '../store/user';
import { PHONE_REGEX } from '../constants';

const DEFAULT_TIMETABLE: OpeningHoursType[] = [];
for (let i = 0; i < 7; i++) {
  DEFAULT_TIMETABLE.push({
    dayOfWeek: i,
    startTime: '09:00',
    breakStartTime: '13:00',
    breakEndTime: '14:00',
    endTime: '18:00'
  });
}

export default function Settings(): ReactElement {
  const history = useHistory();
  const { token } = useContext(authContext);

  const [, mutate] = useContext(userContext);
  const { clinicMutate } = mutate;

  const initialValues = {
    name: '',
    address: '',
    phone: '',
    contactEmail: '',
    animalTypes: [],
    openingHours: DEFAULT_TIMETABLE
  };

  console.log(initialValues);

  const validationSchema = Yup.object({
    name: Yup.string(),
    address: Yup.string(),
    phone: Yup.string().matches(PHONE_REGEX, 'Phone number is not valid'),
    contactEmail: Yup.string().email('Invalid email format'),
    animalTypes: Yup.array(),
    openingHours: Yup.array()
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
                <div role="group" aria-labelledby="checkbox-group">
                  Treatable animal types:
                  {['dog', 'cat', 'rabbit', 'turtle'].map((animalType) => (
                    <label key={animalType}>
                      <Field
                        type="checkbox"
                        name="animalTypes"
                        value={animalType}
                      />
                      {animalType}
                    </label>
                  ))}
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
                          name={`openingHours.${index}.startTime`}
                          value="09:00"
                        />
                        break start time
                        <Field
                          type="time"
                          name={`openingHours.${index}.breakStartTime`}
                          value="13:00"
                        />
                        break end time
                        <Field
                          type="time"
                          name={`openingHours.${index}.breakEndTime`}
                          value="14:00"
                        />
                        end time
                        <Field
                          type="time"
                          name={`openingHours.${index}.endTime`}
                          value="18:00"
                        />
                      </label>
                      <br />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
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
