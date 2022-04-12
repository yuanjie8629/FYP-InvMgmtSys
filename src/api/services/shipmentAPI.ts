import axios from '@api/axiosInstance';

export const shippingFeeListAPI = (searchParam?: string) =>
  axios.get(
    `shipment/shipping_fee/${searchParam !== undefined ? searchParam : ''}`
  );

export const shippingFeeDetailsAPI = (id) =>
  axios.get(`shipment/shipping_fee/${id}/`);

export const shippingFeeAddAPI = (data) =>
  axios.post(`shipment/shipping_fee/`, data);

export const shippingFeeStateListAPI = () =>
  axios.get(`shipment/shipping_fee/state/`);

export const shippingFeeDelAPI = (id) =>
  axios.delete(`shipment/shipping_fee/${id}/`);

export const shippingFeeBulkDelAPI = (ids: number[]) =>
  axios.post(`shipment/shipping_fee/bulk/delete/`, { ids: ids });

export const pickupLocListAPI = (searchParam?: string) =>
  axios.get(
    `shipment/pickup_loc/${searchParam !== undefined ? searchParam : ''}`
  );

export const pickupLocDetailsAPI = (id) =>
  axios.get(`shipment/pickup_loc/${id}/`);

export const pickupLocAddAPI = (data) =>
  axios.post(`shipment/pickup_loc/`, data);

export const pickupLocDelAPI = (id) =>
  axios.delete(`shipment/pickup_loc/${id}/`);

export const pickupLocBulkDelAPI = (ids: number[]) =>
  axios.post(`shipment/pickup_loc/bulk/delete/`, { ids: ids });

export const pickupLocUpdAPI = (id,data) =>
  axios.patch(`shipment/pickup_loc/${id}/`, data);
