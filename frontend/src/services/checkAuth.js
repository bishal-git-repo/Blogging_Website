import axiosInstance from './axiosInstance';

const checkAuth = async () => {
  try {
    const response = await axiosInstance.get('/auth/login/check');
    return response.data.authenticated; // Backend now returns `authenticated: true/false`
  } catch (error) {
    console.error('Auth check failed:', error.message);
    return false;
  }
};

export default checkAuth;
