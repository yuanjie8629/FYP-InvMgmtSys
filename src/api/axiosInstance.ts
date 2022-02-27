import { clearStorage } from '@/utils/storageUtils';
import oriAxios from 'axios';
import Cookies from 'js-cookie';
import { refreshTknAPI } from './services/authAPI';
const localBaseURL = 'http://127.0.0.1:8000/api/';
const serverBaseURL = 'https://fyp-shrf.herokuapp.com/api/';

const axios = oriAxios.create({
  baseURL: process.env.NODE_ENV === 'production' ? serverBaseURL : localBaseURL,
  timeout: 10000,
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
      clearStorage();
      window.location.href = '';
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
          console.log(res.data);
          originalRequest.headers['Authorization'] = `JWT ${Cookies.get(
            'access_token'
          )}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    return Promise.reject(error);
  }
);

export default axios;
