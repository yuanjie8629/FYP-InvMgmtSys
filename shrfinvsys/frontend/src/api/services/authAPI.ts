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
  axios.defaults.headers['Authorization'] = null;
  Cookies.remove('access_token');
  return axios.post('logout/');
};

export const refreshTknAPI = () =>
  axios
    .post('token/verify/')
    .then((res) => console.log('valid'))
    .catch((err) => {
      if (
        err.response.status === 401 &&
        err.response.data.code === 'token_not_valid'
      ) {
        Cookies.remove('access_token');
      }
    });
