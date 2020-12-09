import React, { ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../store/auth';

export default function Navbar(): ReactElement {
  const { token } = useContext(authContext);

  return token ? (
    <div>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/pets">Pets</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/logout">Logout</Link>
    </div>
  ) : (
    <div>
      <Link to="/">Home</Link>
      <Link to="/signup">Register</Link>
      <Link to="/login">Login</Link>
    </div>
  );
}
