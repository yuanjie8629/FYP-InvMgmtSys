import axios from '@api/axiosInstance';

export const productPrevAPI = (searchParam?: string) =>
  axios.get(
    `item/product/prev/${searchParam !== undefined ? searchParam : ''}`
  );

export const productDelAPI = (id: number) =>
  axios.delete(`item/product/${id}/`);

export const productBulkDelAPI = (ids: number[]) =>
  axios.post(`item/product/bulk/delete/`, { ids: ids });

export const productUpdAPI = (
  id: number,
  data: { [key: string]: string | number }
) => axios.patch(`item/product/${id}/`, data);

export const productBulkUpdAPI = (data: { [key: string]: string | number }[]) =>
  axios.patch(`item/product/bulk/update/`, { list: data });
