import axios from '@api/axiosInstance';

export const voucherViewAPI = (searchParam?: string) =>
  axios.get(`voucher/${searchParam !== undefined ? searchParam : ''}`);

export const voucherDetailsAPI = (id: string) => axios.get(`voucher/${id}/`);

export const voucherCreateAPI = (data) => axios.post(`voucher/`, data);

export const voucherUpdAPI = (id, data) => axios.patch(`voucher/${id}/`, data);

export const voucherDelAPI = (id) => axios.delete(`voucher/${id}/`);

export const voucherBulkDelAPI = (ids: number[]) =>
  axios.post(`voucher/bulk/delete/`, { ids: ids });

export const voucherBulkUpdAPI = (data: { [key: string]: string | number }[]) =>
  axios.patch(`voucher/bulk/update/`, { list: data });
