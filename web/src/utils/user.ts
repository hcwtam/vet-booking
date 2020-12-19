import {
  AddPetForm,
  PetChangeForm,
  AddVetForm,
  VetChangeForm,
  ClinicSettingsData,
  OwnerSettingsData
} from '../types/forms';
import axios from './axiosInstance';

export const changeUserInfo = async (
  values: OwnerSettingsData | ClinicSettingsData,
  token: string
) => {
  return axios
    .put('/user/profile', values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const addPet = async (values: AddPetForm, token: string) => {
  return axios
    .post('/pet', values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const changePetInfo = async (
  values: PetChangeForm,
  id: string,
  token: string
) => {
  return axios
    .put(`/pet/${id}`, values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const deletePet = async (id: string, token: string) => {
  return axios
    .delete(`/pet/${id}`, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const changeClinicInfo = async (
  values: ClinicSettingsData,
  token: string
) => {
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
