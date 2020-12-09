import React, { ReactElement, useContext, useEffect } from 'react';

import { userContext } from '../store/user';

export default function Profile(): ReactElement {
  const [data, mutate] = useContext(userContext);
  const { user } = data;
  const { email, firstName, lastName, uid, userType, username } = user;

  const { userMutate } = mutate;

  useEffect(() => {
    userMutate();
  }, [userMutate]);

  return (
    <div>
      <h1>Profile</h1>
      <ul>
        <li>email: {email}</li>
        <li>first name: {firstName}</li>
        <li>last name: {lastName}</li>
        <li>uid: {uid}</li>
        <li>user type: {userType}</li>
        <li>username: {username}</li>
      </ul>
    </div>
  );
}
