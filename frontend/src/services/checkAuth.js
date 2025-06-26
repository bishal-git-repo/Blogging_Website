import axiosInstance from "./axiosInstance";

const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/auth/login/check');
      return response.data; // Assume backend returns { authenticated: true/false }
    } catch (error) {
      return false; // Set to false if an error occurs
    }
};

export default checkAuth;
