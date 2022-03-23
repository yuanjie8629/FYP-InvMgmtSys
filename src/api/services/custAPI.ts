import axios from '@api/axiosInstance';

export const custListAPI = (searchParam?: string) =>
  axios.get(`customer/${searchParam !== undefined ? searchParam : ''}`);

export const custRegListAPI = (searchParam?: string) =>
  axios.get(
    `customer/registration/${searchParam !== undefined ? searchParam : ''}`
  );

export const custRegUpdAPI = (
  data: { [key: string]: string | number | boolean }[]
) => axios.patch(`customer/registration/update/`, { list: data });

export const custStatusUpdAPI = (
  data: { [key: string]: string | number | boolean }[]
) => axios.patch(`customer/status/update/`, { list: data });

export const custDetailsAPI = (id) => axios.get(`customer/${id}/`);

export const custRegDetailsAPI = (id) =>
  axios.get(`customer/registration/${id}/`);

export const posRegAPI = (data) => axios.post(`customer/`, data);
