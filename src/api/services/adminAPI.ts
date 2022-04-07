import axios from '@api/axiosInstance';
import { getAdminInfo } from '@utils/storageUtils';

export const adminDetailsAPI = () => {
  return axios.get(`admin/${getAdminInfo()?.id}/`);
};

export const adminUpdateAPI = (data) => {
  return axios.patch(`admin/${getAdminInfo()?.id}/`, data);
};

export const changePassAPI = (data) =>
  axios.patch(`admin/${getAdminInfo()?.id}/change_pass/`, data);
