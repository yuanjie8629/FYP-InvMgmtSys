import oriAxios from 'axios';
import Cookies from 'js-cookie';
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
      return Promise.reject(error);
    }

    if (
      error.response.data.code === 'token_not_valid' &&
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized' &&
      originalRequest.url !== 'token/verify/'
    ) {
      return axios
        .post('token/refresh/')
        .then((response) => {
          axios.defaults.headers['Authorization'] =
            'JWT ' + response.data.access;

          originalRequest.headers['Authorization'] =
            'JWT ' + response.data.access;

          return axios(originalRequest);
        })
        .catch((err) => console.log(err));
    }

    return Promise.reject(error);
  }
);

export default axios;
