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
      return Promise.resolve(res);
    })
    .catch((error) => Promise.reject(error));
};

export const logoutAPI = () => {
  delete axios.defaults.headers['Authorization'];
  Cookies.remove('access_token');
  localStorage.setItem('usr', 'expired');
  return axios.post('logout/');
};

export const verifyTknAPI = () => axios.post('token/verify/');

export const refreshTknAPI = () =>
  axios
    .post('token/refresh/')
    .then((res) => {
      axios.defaults.headers['Authorization'] = 'JWT ' + res.data.access;
      return Promise.resolve(res);
    })
    .catch((err) => {
      delete axios.defaults.headers['Authorization'];
      Cookies.remove('access_token');
      localStorage.setItem('usr', 'expired');
      return Promise.reject(err);
    });
