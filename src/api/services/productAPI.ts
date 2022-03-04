import axios from '@api/axiosInstance';

export const productPrevAPI = (searchParam?: string) =>
  axios.get(
    `item/products/prev/${searchParam !== undefined ? searchParam : ''}`
  );

export const productDelAPI = (pk: number) =>
  axios.delete(`item/products/${pk}`);
