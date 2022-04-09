import axios from '@api/axiosInstance';
import { getAccessTknExpiry } from '@utils/storageUtils';
import moment from 'moment';
import { refreshTknAPI } from './authAPI';

export const packagePrevAPI = (searchParam?: string) =>
  axios.get(
    `item/package/prev/${searchParam !== undefined ? searchParam : ''}`
  );

export const packageDetailsAPI = (id: string) =>
  axios.get(`item/package/${id}/`);

export const packageCreateAPI = (data) => {
  if (getAccessTknExpiry() < moment().unix()) {
    return refreshTknAPI().then((res) =>
      axios.post(`item/package/`, data, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
    );
  } else {
    return axios.post(`item/package/`, data, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
};

export const packageUpdAPI = (id, data) => {
  if (getAccessTknExpiry() < moment().unix()) {
    return refreshTknAPI().then((res) =>
      axios.patch(`item/package/${id}/`, data, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
    );
  } else {
    return axios.patch(`item/package/${id}/`, data, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
};

export const packageDelAPI = (id: number) =>
  axios.delete(`item/package/${id}/`);

export const itemBulkDelAPI = (ids: number[]) =>
  axios.post(`item/bulk/delete/`, { ids: ids });

// export const packageUpdAPI = (
//   id: number,
//   data: { [key: string]: string | number }
// ) => axios.patch(`item/package/${id}/`, data);

export const packageBulkUpdAPI = (data: { [key: string]: string | number }[]) =>
  axios.patch(`item/package/bulk/update/`, { list: data });
