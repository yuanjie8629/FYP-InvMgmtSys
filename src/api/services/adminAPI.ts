import axios from '@api/axiosInstance';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const adminDetailsAPI = () => {
  let { user_id }: any = jwtDecode(Cookies.get('access_token'));
  return axios.get(`admin/${user_id}/`);
};
