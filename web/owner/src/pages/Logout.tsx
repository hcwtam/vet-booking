import React, { ReactElement, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';

import { authContext } from '../store/auth';
import { logout } from '../utils/auth';

export default function Logout(): ReactElement {
  const { setToken } = useContext(authContext);
  const history = useHistory();

  useEffect(() => {
    logout();
    setToken('');
    history.push('/');
  }, [setToken, history]);

  return <div></div>;
}
