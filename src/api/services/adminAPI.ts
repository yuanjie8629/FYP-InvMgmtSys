import axios from '@api/axiosInstance';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

let { user_id }: any = jwtDecode(Cookies.get('access_token'));

export const adminDetailsAPI = () => {
  return axios.get(`admin/${user_id}/`);
};

export const adminUpdateAPI = (data) => {
  return axios.patch(`admin/${user_id}/`, data);
};

export const changePassAPI = (data) =>
  axios.patch(`admin/${user_id}/change_pass/`, data);
