import axios from '@api/axiosInstance';

export const notificationListAPI = () => axios.get(`notification/`);

export const notificationReadAPI = (
  data: { [key: string]: string | number | boolean }[]
) => axios.post(`notification/`, { list: data });
