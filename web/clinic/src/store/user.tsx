import React, { ReactElement, createContext, useContext } from 'react';
import useSWR from 'swr';
import { authContext } from './auth';

interface Props {
  children: ReactElement;
}

type UserContext = [
  { user: UserType; clinic: ClinicType },
  {
    userMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
    clinicMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
  }
];

type UserType = {
  uid: string;
  email: string;
  username: string;
  userType: string;
};

export type ClinicType = {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
  contactEmail?: string;
};

const INIT_USERTYPE = {
  uid: '',
  email: '',
  username: '',
  userType: ''
};

const INIT_CLINICTYPE = {
  id: '',
  name: '',
  address: '',
  phone: '',
  contactEmail: ''
};

const userContext = createContext<UserContext>([
  { user: INIT_USERTYPE, clinic: INIT_CLINICTYPE },
  {
    userMutate: () => null,
    clinicMutate: () => null
  }
]);

const { Provider } = userContext;

function UserProvider({ children }: Props): ReactElement {
  const { token } = useContext(authContext);

  const { data: userData, mutate: userMutate } = useSWR(
    token ? ['user/profile', token] : null
  );
  const { data: clinicData, mutate: clinicMutate } = useSWR(
    token ? ['user/clinic', token] : null
  );

  let user = INIT_USERTYPE;
  if (userData) user = userData.data.user;

  let clinic = INIT_CLINICTYPE;
  if (clinicData) clinic = clinicData.data.clinic;

  return (
    <Provider
      value={[
        { user, clinic },
        { userMutate, clinicMutate }
      ]}
    >
      {children}
    </Provider>
  );
}

export { userContext, UserProvider };
