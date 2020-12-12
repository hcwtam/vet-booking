import { OpeningHoursType } from '../store/user';
import axios from './axiosInstance';

export type SettingsData = {
  name: string;
  address: string;
  phone: string;
  contactEmail: string;
  animalTypes: string[];
  openingHours: OpeningHoursType[];
};

export type AddVetForm = {
  firstName: string;
  lastName: string;
  phone: string;
  clinicId: string;
  specialties: string[];
};

export type VetChangeForm = {
  firstName: string;
  lastName: string;
};

export const changeClinicInfo = async (values: SettingsData, token: string) => {
  return axios
    .put('/user/clinic', values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const addVet = async (values: AddVetForm, token: string) => {
  return axios
    .post('/vet', values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const changeVetInfo = async (
  values: VetChangeForm,
  id: string,
  token: string
) => {
  return axios
    .put(`/vet/${id}`, values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const deleteVet = async (id: string, token: string) => {
  return axios
    .delete(`/vet/${id}`, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
