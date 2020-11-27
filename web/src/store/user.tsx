import React, { ReactElement, createContext, useContext } from 'react';
import useSWR from 'swr';
import { authContext } from './auth';

interface Props {
  children: ReactElement;
}

type UserContext = [
  { user: UserType; pets: PetType[] },
  {
    userMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
    petsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
  }
];

type UserType = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: string;
};

export type PetType = {
  id: number;
  name: string;
  animalType: string;
  birthDate?: string;
  gender: string;
  desexed: boolean;
  illnesses: string[];
};

const INIT_USERTYPE = {
  uid: '',
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  userType: ''
};

const userContext = createContext<UserContext>([
  { user: INIT_USERTYPE, pets: [] as PetType[] },
  {
    userMutate: () => null,
    petsMutate: () => null
  }
]);

const { Provider } = userContext;

function UserProvider({ children }: Props): ReactElement {
  const { token } = useContext(authContext);

  const { data: userData, mutate: userMutate } = useSWR(
    token ? ['user/profile', token] : null
  );
  const { data: petsData, mutate: petsMutate } = useSWR(
    token ? ['pet', token] : null
  );

  let user = INIT_USERTYPE;
  if (userData) user = userData.data.user;

  let pets: PetType[] = [];
  if (petsData) pets = petsData.data.pets;

  return (
    <Provider
      value={[
        { user, pets },
        { userMutate, petsMutate }
      ]}
    >
      {children}
    </Provider>
  );
}

export { userContext, UserProvider };
