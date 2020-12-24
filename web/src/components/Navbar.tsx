import React, { ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../store/auth';

export default function Navbar(): ReactElement {
  const { token, userType } = useContext(authContext);

  let navbarWithUser = <></>;
  if (userType === 'owner')
    navbarWithUser = (
      <div>
        <Link to="/">Home</Link>
        <Link to="/bookings">Booking</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/logout">Logout</Link>
      </div>
    );
  if (userType === 'clinic')
    navbarWithUser = (
      <div>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/vets">Vets</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/logout">Logout</Link>
      </div>
    );

  return token ? (
    navbarWithUser
  ) : (
    <div>
      <Link to="/">Home</Link>
      {'  '}
      <Link to="/signup">Register{'(owner)'}</Link>
      {'  '}
      <Link to="/clinicsignup">Register{'(clinic)'}</Link>
      {'  '}
      <Link to="/login">Login</Link>
    </div>
  );
}
