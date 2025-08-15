import axios from '../../utils/axiosInstance';

export const fetchMessages = (chatId) => {
  return axios.get(`/message/${chatId}`);
};
export const sendMessage = (chatId, formData) => {
  return axios.post(`/message/${chatId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};