import React, { ReactElement, createContext, useContext } from 'react';
import useSWR from 'swr';
import { authContext } from './auth';

interface Props {
  children: ReactElement;
}

interface UserType {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: string;
}

const INIT_USERTYPE = {
  uid: '',
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  userType: ''
};

const userContext = createContext<UserType>(INIT_USERTYPE);

const { Provider } = userContext;

function UserProvider({ children }: Props): ReactElement {
  const { token } = useContext(authContext);

  const { data } = useSWR(token ? token : null);
  let userData = INIT_USERTYPE;
  if (data) userData = data.data.user;

  return <Provider value={userData}>{children}</Provider>;
}

export { userContext, UserProvider };
