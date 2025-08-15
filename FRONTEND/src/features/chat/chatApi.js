import axios from '../../utils/axiosInstance.js'

export const fetchMychats = ()=> axios.get('/chat', { withCredentials: true });

export const accessChats = (receiverId) => axios.get(`/chat/access/${receiverId}`, {withCredentials:true})