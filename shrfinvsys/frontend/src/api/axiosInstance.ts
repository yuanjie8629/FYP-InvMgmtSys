import oriAxios from 'axios';
import Cookies from 'js-cookie';
import { refreshTknAPI } from './services/authAPI';
const baseURL = 'http://127.0.0.1:8000/api/';

const axios = oriAxios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: Cookies.get('access_token')
      ? `JWT ${Cookies.get('access_token')}`
      : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
  withCredentials: true,
});

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    if (typeof error.response === 'undefined') {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === 'token/refresh/'
    ) {
      delete axios.defaults.headers['Authorization'];
      Cookies.remove('access_token');
      localStorage.setItem('usr', 'expired');
      return Promise.reject(error);
    }

    if (
      error.response.data.code === 'token_not_valid' &&
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized' &&
      originalRequest.url !== 'token/verify/'
    ) {
      return refreshTknAPI()
        .then((res) => {
          originalRequest.headers['Authorization'] = 'JWT ' + res.data.access;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    return Promise.reject(error);
  }
);

export default axios;
