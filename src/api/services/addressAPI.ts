import axios from '@api/axiosInstance';

export const stateListAPI = () => axios.get(`postcode/state/`);

export const postcodeListAPI = () => axios.get(`postcode/`);