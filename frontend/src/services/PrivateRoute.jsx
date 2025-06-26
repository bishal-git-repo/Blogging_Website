import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import checkAuth from './checkAuth';

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const result = await checkAuth();
      setIsAuthenticated(result);
    };

    fetchAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading authentication...</div>; // Show loading spinner
  }

  if (isAuthenticated === true) {
    return <>{element}</>;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
