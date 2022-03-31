import axios from '@api/axiosInstance';

export const toDoListAPI = () => axios.get(`analysis/to_do_list/`);

export const statisticsAPI = () => axios.get(`analysis/statistics/`);