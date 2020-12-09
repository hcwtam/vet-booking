import axios from './axiosInstance';

export type SettingsData = {
  firstName: string;
  lastName: string;
};

export type AddPetForm = {
  name: string;
  gender: string;
  desexed: string;
};

export type PetChangeForm = {
  name: string;
};

export const changeUserInfo = async (values: SettingsData, token: string) => {
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
