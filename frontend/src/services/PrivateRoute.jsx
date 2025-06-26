import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import checkAuth from './checkAuth';

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` means loading state

  useEffect(() => {
    // Verify authentication with the backend
    const fetchAuthStatus = async () => {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
    };

    fetchAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    // Show a loading spinner or placeholder while checking authentication
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // If authenticated, render the protected component
    return <>{element}</>;
  }

  // If not authenticated, redirect to the Login page
  return <Navigate to="/login" />;
};

export default PrivateRoute;
