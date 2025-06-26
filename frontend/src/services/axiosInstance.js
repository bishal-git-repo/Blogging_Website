import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://simpel-blog-backend.onrender.com', // Backend URL
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;
