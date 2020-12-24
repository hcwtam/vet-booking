import React, { ReactElement, createContext, useContext } from 'react';
import useSWR from 'swr';
import {
  UserType,
  PetType,
  ClinicType,
  VetType,
  BookingType
} from '../types/types';
import { authContext } from './auth';

interface Props {
  children: ReactElement;
}

type UserContext = [
  {
    user: UserType;
    pets: PetType[];
    clinic: ClinicType;
    vets: VetType[];
    bookings: BookingType[];
  },
  {
    userMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
    petsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
    clinicMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
    vetsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
    bookingsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
  }
];

const INIT_USERTYPE = {
  uid: '',
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  userType: '',
  petOwnerId: ''
};

const INIT_CLINICTYPE = {
  id: '',
  name: '',
  address: '',
  phone: '',
  contactEmail: '',
  animalTypes: [],
  openingHours: []
};

const userContext = createContext<UserContext>([
  {
    user: INIT_USERTYPE,
    pets: [] as PetType[],
    clinic: INIT_CLINICTYPE,
    vets: [] as VetType[],
    bookings: [] as BookingType[]
  },
  {
    userMutate: () => null,
    petsMutate: () => null,
    clinicMutate: () => null,
    vetsMutate: () => null,
    bookingsMutate: () => null
  }
]);

const { Provider } = userContext;

function UserProvider({ children }: Props): ReactElement {
  const { token, userType } = useContext(authContext);

  const { data: userData, mutate: userMutate } = useSWR(
    token ? ['user/profile', token] : null
  );

  const { data: petsData, mutate: petsMutate } = useSWR(
    token && userType === 'owner' ? ['pet', token] : null
  );

  const { data: clinicData, mutate: clinicMutate } = useSWR(
    token && userType === 'clinic' ? ['user/clinic', token] : null
  );
  const { data: vetsData, mutate: vetsMutate } = useSWR(
    token && userType === 'clinic' ? ['vet', token] : null
  );
  const { data: bookingsData, mutate: bookingsMutate } = useSWR(
    token && userType === 'owner' ? ['booking', token] : null
  );

  let user = INIT_USERTYPE;
  if (userData) user = userData.data.user;

  let pets: PetType[] = [];
  if (petsData) pets = petsData.data.pets;

  let clinic = INIT_CLINICTYPE;
  if (clinicData) clinic = clinicData.data.clinic;

  let vets: VetType[] = [];
  if (vetsData) {
    vets = vetsData.data.vets;
  }

  let bookings: BookingType[] = [];
  if (bookingsData) {
    bookings = bookingsData.data.bookings;
  }

  return (
    <Provider
      value={[
        { user, pets, clinic, vets, bookings },
        { userMutate, petsMutate, clinicMutate, vetsMutate, bookingsMutate }
      ]}
    >
      {children}
    </Provider>
  );
}

export { userContext, UserProvider };
