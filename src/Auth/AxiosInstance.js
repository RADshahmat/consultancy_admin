// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend.hurairaconsultancy.com/',
  withCredentials: true, 
});

export default axiosInstance;
