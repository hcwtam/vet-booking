import React, { ReactElement, useContext, useEffect } from 'react';

import { authContext } from '../store/auth';
import { logout } from '../utils/auth';

export default function Logout(): ReactElement {
  const { setToken } = useContext(authContext);

  useEffect(() => {
    logout();
    setToken('');
  }, [setToken]);

  return <div></div>;
}
