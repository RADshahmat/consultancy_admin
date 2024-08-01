// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:3003/',
  baseURL: 'https://backend.hurairaconsultancy.com/',
  //withCredentials: true, 
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token1');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
