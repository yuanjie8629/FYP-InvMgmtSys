import axios from '@api/axiosInstance';

export const packagePrevAPI = (searchParam?: string) =>
  axios.get(
    `item/package/prev/${searchParam !== undefined ? searchParam : ''}`
  );

export const packageDetailsAPI = (id: string) =>
  axios.get(`item/package/${id}/`);

export const packageCreateAPI = (data) =>
  axios.post(`item/package/`, data, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });

export const packageUpdFileAPI = (id, data) =>
  axios.patch(`item/package/${id}/`, data, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });

export const packageDelAPI = (id: number) =>
  axios.delete(`item/package/${id}/`);

export const itemBulkDelAPI = (ids: number[]) =>
  axios.post(`item/bulk/delete/`, { ids: ids });

export const packageUpdAPI = (
  id: number,
  data: { [key: string]: string | number }
) => axios.patch(`item/package/${id}/`, data);

export const packageBulkUpdAPI = (data: { [key: string]: string | number }[]) =>
  axios.patch(`item/package/bulk/update/`, { list: data });
