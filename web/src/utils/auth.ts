import axios from './axiosInstance';

type FormData = {
  email?: string;
  fullName?: string;
  username: string;
  password: string;
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

export const login = async (values: FormData) => {
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
      console.log(res.data.token);

      return res.data.token;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const signup = async (values: FormData) => {
  const { email, fullName, username } = values;

  return axios
    .post(`https://${process.env.API_ENDPOINT}`, {
      ...values,
      returnSecureToken: true
    })
    .then((res) => {
      console.log(res);
      const expirationDate = (Date.now() * 30 * 60 * 1000) // from now to 30 minutes later
        .toString();

      localStorage.setItem('token', res.data.idToken);
      localStorage.setItem('expirationDate', expirationDate);

      return axios
        .post(`https://reactgram-ac3b0.firebaseio.com/users.json`, {
          email,
          fullName,
          username
        })
        .then((r) => {
          console.log([res.data.idToken]);
          return [res.data.idToken];
        })
        .catch((err) => {
          console.log(err.response.data.error.message);
          return null;
        });
    })
    .catch((err) => {
      console.log(err.response.data.error.message);
      return null;
    });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
};
