import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://blogging-website-backend-ry4p.onrender.com', // Backend URL
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;
