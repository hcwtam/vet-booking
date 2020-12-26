import { BookingChangeForm } from '../types/forms';
import { BookingType } from '../types/types';
import axios from './axiosInstance';

export const postBooking = async (values: BookingType, token: string = '') => {
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

export const changeBookingTime = async (
  values: BookingChangeForm,
  id: string,
  token: string
) => {
  return axios
    .put(`/booking/${id}`, values, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const deleteBooking = async (id: string, token: string) => {
  return axios
    .delete(`/booking/${id}`, {
      headers: {
        'x-access-token': token
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
