import { clearStorage } from '@utils/storageUtils';
import oriAxios from 'axios';
import Cookies from 'js-cookie';
import { refreshTknAPI } from './services/authAPI';

const localBaseURL = 'http://127.0.0.1:8000/api/';
const serverBaseURL = 'https://fyp-shrf.herokuapp.com/api/';

export const baseURL =
  process.env.NODE_ENV === 'production' ? serverBaseURL : localBaseURL;

const axios = oriAxios.create({
  baseURL: baseURL,
  headers: {
    Authorization: Cookies.get('access_token')
      ? `JWT ${Cookies.get('access_token')}`
      : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
  timeout: 60000,
  withCredentials: true,
});

axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');

let refresh = false;
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
      originalRequest.url !== 'token/verify/' &&
      !refresh
    ) {
      refresh = true;
      console.log('Requesting new session.');
      return await refreshTknAPI()
        .then(async (res) => {
          originalRequest.headers['Authorization'] = `JWT ${Cookies.get(
            'access_token'
          )}`;
          console.log('New session obtained.');
          return await axios(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        })
        .finally(() => {
          refresh = false;
        });
    }

    return Promise.reject(error);
  }
);

export default axios;
