import axios from '@api/axiosInstance';
import { getAccessTknExpiry } from '@utils/storageUtils';
import moment from 'moment';
import { refreshTknAPI } from './authAPI';

export const productPrevAPI = (searchParam?: string) =>
  axios.get(
    `item/product/prev/${searchParam !== undefined ? searchParam : ''}`
  );

export const productPrevAllAPI = () => axios.get(`item/product/prev/all/`);

export const productDetailsAPI = (id: string) =>
  axios.get(`item/product/${id}/`);

export const productCreateAPI = async (data) => {
  console.log(getAccessTknExpiry() > moment().unix());
  if (getAccessTknExpiry() < moment().unix()) {
    await refreshTknAPI();
  }
  return axios.post(`item/product/`, data, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const productUpdAPI = (id, data) =>
  axios.patch(`item/product/${id}/`, data, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });

export const productDelAPI = (id: number) =>
  axios.delete(`item/product/${id}/`);

export const itemBulkDelAPI = (ids: number[]) =>
  axios.post(`item/bulk/delete/`, { ids: ids });

// export const productUpdAPI = (
//   id: number,
//   data: { [key: string]: string | number }
// ) =>
//   axios.patch(`item/product/${id}/`, data, {
//     headers: {
//       'content-type': 'multipart/form-data',
//     },
//   });

export const productBulkUpdAPI = (data: { [key: string]: string | number }[]) =>
  axios.patch(`item/product/bulk/update/`, { list: data });
