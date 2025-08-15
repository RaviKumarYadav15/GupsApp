import axios from '../../utils/axiosInstance';
export const loginUser = (data) => axios.post('/users/login', data);

export const registerUser = (data) => axios.post('/users/register', data);

export const logoutUser = () => axios.post('/users/logout');

export const getProfile = () => axios.get('/users/profile');

export const getOtherUsers = () => axios.get('/users/otherUsers');