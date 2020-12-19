import React, { ReactElement, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';

import { authContext } from '../store/auth';
import { logout } from '../utils/auth';

export default function Logout(): ReactElement {
  const { setToken, setUserType } = useContext(authContext);
  const history = useHistory();

  useEffect(() => {
    logout();
    setToken('');
    setUserType('');
    history.push('/');
  }, [setToken, setUserType, history]);

  return <div></div>;
}
