import axios from '@api/axiosInstance';
import Cookies from 'js-cookie';

export const productPrevAPI = (searchParam?: string) =>
  axios.get(
    `item/products/prev${searchParam !== undefined ? searchParam : ''}`
  );
console.log(Cookies.get('csfttoken'));
export const productDelAPI = (pk: number) =>
  axios.delete(`item/products/${pk}/`);
