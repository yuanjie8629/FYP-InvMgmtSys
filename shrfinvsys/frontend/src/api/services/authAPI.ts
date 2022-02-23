import axios from '@/api/axiosInstance';

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
      localStorage.setItem('access_token', res.data.access);

      axios.defaults.headers['Authorization'] = `JWT ${localStorage.getItem(
        'access_token'
      )}`;
      window.location.href = '/';
      return Promise.resolve(res);
    })
    .catch((error) => Promise.reject(error));
};

export const logoutAPI = () => {
  localStorage.removeItem('access_token');
  axios.defaults.headers['Authorization'] = null;
  return axios.post('logout/');
};
