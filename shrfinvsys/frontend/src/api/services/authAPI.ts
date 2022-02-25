import { clearStorage, setUsr } from '@/utils/storageUtils';
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
      setUsr(res.data);
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
      setUsr(res.data);
      axios.defaults.headers['Authorization'] = 'JWT ' + res.data.access;
      return Promise.resolve(res);
    })
    .catch((err) => {
      delete axios.defaults.headers['Authorization'];
      Cookies.remove('access_token');
      clearStorage();
      window.location.href = '';
      return Promise.reject(err);
    });
