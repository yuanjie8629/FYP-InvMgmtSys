import axios from '@api/axiosInstance';
import { getAdminInfo } from '@utils/storageUtils';

export const adminDetailsAPI = () => {
  return axios.get(`admin/${getAdminInfo()}/`);
};

export const adminUpdateAPI = (data) => {
  return axios.patch(`admin/${getAdminInfo()}/`, data);
};

export const changePassAPI = (data) =>
  axios.patch(`admin/${getAdminInfo()}/change_pass/`, data);
