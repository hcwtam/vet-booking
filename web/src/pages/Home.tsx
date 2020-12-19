import React, { ReactElement, useContext } from 'react';
import { userContext } from '../store/user';

export default function Home(): ReactElement {
  const [{ user }] = useContext(userContext);
  return (
    <div>
      Welcome to Vet Booking System {user.userType && `for ${user.userType}`}
    </div>
  );
}
