import axios from './axiosInstance';

export type SettingsData = {
  name: string;
  address: string;
  phone: string;
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
