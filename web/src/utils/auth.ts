import axios from './axiosInstance';

export type LoginFormData = {
  username: string;
  password: string;
};

export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  userType: string;
};

export interface UserData {
  email: string;
  fullName: string;
  userId: string;
  username: string;
  website?: string;
  bio?: string;
  uid?: string;
  bookmarks?: string[];
  followers?: string[];
  following: string[];
  avatarUrl?: string;
}

export const login = async (values: LoginFormData) => {
  return axios
    .post(`/user/login`, {
      ...values
    })
    .then((res) => {
      // console.log(res);
      const expirationDate = (Date.now() * 30 * 60 * 1000) // from now to 30 minutes later
        .toString();

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('expirationDate', expirationDate);

      return res.data.token;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const signup = async (values: SignupFormData) => {
  return axios
    .post(`/user`, {
      ...values
    })
    .then((res) => {
      console.log(res);
      const expirationDate = (Date.now() * 30 * 60 * 1000) // from now to 30 minutes later
        .toString();

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('expirationDate', expirationDate);
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
};
