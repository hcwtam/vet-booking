import React, { ReactElement, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';

import { userContext } from '../store/user';

export default function Profile(): ReactElement {
  const history = useHistory();

  const [data, mutate] = useContext(userContext);
  const { user, clinic } = data;
  const { email, uid, userType, username } = user;
  const { userMutate, clinicMutate } = mutate;

  useEffect(() => {
    userMutate();
    clinicMutate();
  }, [userMutate, clinicMutate]);

  return (
    <div>
      <h1>Profile</h1>
      <ul>
        <li>email: {email}</li>
        <li>uid: {uid}</li>
        <li>user type: {userType}</li>
        <li>username: {username}</li>
      </ul>
      {clinic.name &&
      clinic.address &&
      clinic.contactEmail &&
      clinic.phone &&
      clinic.animalTypes?.length &&
      clinic.openingHours?.length ? (
        <>
          <h1>Clinic Info</h1>
          <ul>
            <li>id: {clinic.id}</li>
            <li>name: {clinic.name}</li>
            <li>address: {clinic.address}</li>
            <li>phone: {clinic.phone}</li>
            <li>contact email: {clinic.contactEmail}</li>
            <li>
              treatable animal types:{' '}
              {clinic.animalTypes.length
                ? clinic.animalTypes.map((animalType) => (
                    <span key={animalType}>{`| ${animalType} |`}</span>
                  ))
                : 'none'}
            </li>
            {clinic.animalTypes.length
              ? clinic.openingHours
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((openingHour) =>
                    openingHour.breakStartTime && openingHour.breakEndTime ? (
                      <li
                        key={openingHour.dayOfWeek}
                      >{`Weekday ${openingHour.dayOfWeek}: | Opening hours: ${openingHour.startTime}-${openingHour.endTime} | Break time: ${openingHour.breakStartTime}-${openingHour.breakEndTime}`}</li>
                    ) : (
                      <li
                        key={openingHour.dayOfWeek}
                      >{`Weekday ${openingHour.dayOfWeek}: | Opening hours: ${openingHour.startTime}-${openingHour.endTime}`}</li>
                    )
                  )
              : 'none'}
          </ul>
        </>
      ) : (
        <>
          <h1>Please set up clinic detail</h1>
          <button onClick={() => history.push('/settings')}>To settings</button>
        </>
      )}
    </div>
  );
}
