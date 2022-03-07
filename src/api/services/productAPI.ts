import axios from '@api/axiosInstance';

export const productPrevAPI = (searchParam?: string) =>
  axios.get(`item/product/prev${searchParam !== undefined ? searchParam : ''}`);

export const productDelAPI = (id: number) =>
  axios.delete(`item/product/${id}/`);

export const productBulkDelAPI = (ids: number[]) =>
  axios.delete(`item/product/?ids=${ids.map((id) => id)}`);
