// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3003/',
  withCredentials: true, 
});

export default axiosInstance;
