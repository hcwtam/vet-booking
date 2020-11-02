import React, { ReactElement, useContext } from 'react';

import { userContext } from '../store/user';

export default function Profile(): ReactElement {
  const userData = useContext(userContext);
  const { email, firstName, lastName, uid, userType, username } = userData;

  return (
    <div>
      <h1>Profile</h1>
      <ul>
        <li>{email}</li>
        <li>{firstName}</li>
        <li>{lastName}</li>
        <li>{uid}</li>
        <li>{userType}</li>
        <li>{username}</li>
      </ul>
    </div>
  );
}
