import { BookingType } from '../types/types';
import axios from './axiosInstance';

export const postBooking = async (values: BookingType, token: string) => {
  return axios
    .post('/booking', values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
