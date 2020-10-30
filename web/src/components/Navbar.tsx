import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(): ReactElement {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/signup">Register</Link>
      <Link to="/login">Login</Link>
    </div>
  );
}
