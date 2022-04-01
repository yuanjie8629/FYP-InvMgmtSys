import axios from '@api/axiosInstance';

export const orderListAPI = (searchParam?: string) =>
  axios.get(`order/${searchParam !== undefined ? searchParam : ''}`);

export const orderDetailsAPI = (id) => axios.get(`order/${id}/`);

export const orderTrackNumUpdAPI = (
  data: { [key: string]: string | number | boolean }[]
) => axios.patch(`order/track_num/update/`, { list: data });

export const orderPickupUpdAPI = (
  data: { [key: string]: string | number | boolean }[]
) => axios.patch(`order/pickup/update/`, { list: data });

export const orderCancelAPI = (
  data: { [key: string]: string | number | boolean }[]
) => axios.patch(`order/cancel/`, { list: data });

export const orderBulkInvoicesAPI = (ids: string[]) =>
  axios.post(`order/invoices/bulk/`, { ids: ids }, { responseType: 'blob' });

export const orderInvoiceAPI = (id) =>
  axios.get(`order/invoice/${id}/`, { responseType: 'blob' });