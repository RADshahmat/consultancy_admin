// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-doc-8n06.onrender.com',
  withCredentials: true, // Ensure this option is set
});

export default axiosInstance;
