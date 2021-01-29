import { Descriptions } from 'antd';
import React, { ReactElement, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import Content from '../components/UI/Content';

import { userContext } from '../store/user';

const Info = styled.div`
  min-width: 60px;
`;
const MediaContainer = styled.div`
  @media (max-width: 750px) {
    padding: 10px;
  }
`;

export default function Profile(): ReactElement {
  const history = useHistory();

  const [data, mutate] = useContext(userContext);
  const { user, clinic } = data;
  const { email, firstName, lastName, userType, username } = user;
  const { userMutate, clinicMutate } = mutate;

  const { Item } = Descriptions;

  useEffect(() => {
    userMutate();
    if (userType === 'clinic') clinicMutate();
  }, [userType, userMutate, clinicMutate]);
  return (
    <Content>
      <MediaContainer>
        <h1>Profile</h1>
        <Descriptions title="Your information" bordered>
          <Item label="Email">
            <Info>{email}</Info>
          </Item>
          <Item label="First name">
            <Info>{firstName}</Info>
          </Item>
          <Item label="Last name">
            <Info>{lastName}</Info>
          </Item>
          <Item label="Username">
            <Info>{username}</Info>
          </Item>
        </Descriptions>
        {userType === 'clinic' ? (
          clinic.name &&
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
                        openingHour.breakStartTime &&
                        openingHour.breakEndTime ? (
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
              <button onClick={() => history.push('/settings')}>
                To settings
              </button>
            </>
          )
        ) : null}
      </MediaContainer>
    </Content>
  );
}
