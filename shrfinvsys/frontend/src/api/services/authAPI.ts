import { clearStorage, setExp } from '@/utils/storageUtils';
import Cookies from 'js-cookie';
import axios from '../axiosInstance';

interface LoginDetailsProps {
  username: string;
  password: string;
}

export const loginAPI = (loginDetails: LoginDetailsProps) => {
  return axios
    .post(`login/`, {
      username: loginDetails.username,
      password: loginDetails.password,
    })
    .then((res) => {
      axios.defaults.headers['Authorization'] = `JWT ${Cookies.get(
        'access_token'
      )}`;
      setExp(res.data.exp);
      window.location.href = '';
      return Promise.resolve(res);
    })
    .catch((error) => Promise.reject(error));
};

export const logoutAPI = () => {
  delete axios.defaults.headers['Authorization'];
  Cookies.remove('access_token');
  clearStorage();
  return axios.post('logout/');
};

export const verifyTknAPI = () => axios.post('token/verify/');

export const refreshTknAPI = () =>
  axios
    .post('token/refresh/')
    .then((res) => {
      setExp(res.data.exp);
      axios.defaults.headers['Authorization'] = `JWT ${Cookies.get(
        'access_token'
      )}`;
      return Promise.resolve(res);
    })
    .catch((err) => {
      delete axios.defaults.headers['Authorization'];
      Cookies.remove('access_token');
      clearStorage();
      return Promise.reject(err);
    });

export const forgotPassAPI = (email: string) =>
  axios
    .post('password_reset/', {
      email: email,
    })
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
