import { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/dashboard');
      setUser(response.data);
    } catch (err) {
      setUser(null);
      if (err.response && err.response.status === 403) {
        navigate('/'); 
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const resp=await axiosInstance.post('/login', { username, password });
      
      const token = resp.data.authorization;
      localStorage.setItem('token1', token);
      localStorage.setItem('dashboardPermission', resp.data.permission);
      localStorage.setItem('dashboardPermission1', resp.data.permission1);
      await checkAuth();
    } catch (err) {
     
      throw new Error('Invalid credentials');
    }
  };

  return {
    user,
    loading,
    login,
    checkAuth,
  };
};

export default useAuth;
