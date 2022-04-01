import axios from '@api/axiosInstance';

export const toDoListAPI = () => axios.get(`analysis/to_do_list/`);

export const statisticsAPI = (fromDate: string, toDate: string) =>
  axios.get(`analysis/statistics/?from_date=${fromDate}&to_date=${toDate}`);

export const topProdSalesAPI = (
  fromDate: string,
  toDate: string,
  category?: string
) =>
  axios.get(
    `item/product/ranking/sales/?limit=6&from_date=${fromDate}&to_date=${toDate}${
      category ? `&category=${category}` : ''
    }`
  );
