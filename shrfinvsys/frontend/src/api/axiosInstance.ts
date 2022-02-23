import oriAxios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

const axios = oriAxios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem('access_token')
      ? `JWT ${localStorage.getItem('access_token')}`
      : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (typeof error.response === 'undefined') {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === '/token/refresh/'
    ) {
      localStorage.clear();
      window.location.href = 'login/';
      return Promise.reject(error);
    }

    if (
      error.response.data.code === 'token_not_valid' &&
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
      return axios
        .post('/token/refresh/')
        .then((response) => {
          localStorage.setItem('access_token', response.data.access);

          axios.defaults.headers['Authorization'] =
            'JWT ' + response.data.access;

          originalRequest.headers['Authorization'] =
            'JWT ' + response.data.access;

          return axios(originalRequest);
        })
        .catch((err) => console.log(err));
    }

    // specific error handling done elsewhere

    return Promise.reject(error);
  }
);

export default axios;
