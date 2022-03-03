import axios from '@api/axiosInstance';

export const productPrevAPI = (searchParam?: string) => {
  return axios
    .get(`item/products/prev/${searchParam !== undefined ? searchParam : ''}`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
};
