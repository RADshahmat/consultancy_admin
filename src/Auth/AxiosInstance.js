// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:3003/',
  baseURL: 'https://backend.hurairaconsultancy.com/',
  withCredentials: true, 
});

export default axiosInstance;
