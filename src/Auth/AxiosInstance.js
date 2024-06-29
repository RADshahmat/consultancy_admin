// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://93.127.166.229:83/',
  withCredentials: true, 
});

export default axiosInstance;
