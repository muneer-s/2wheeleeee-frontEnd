import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store';

const AdminProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { adminData } = useAppSelector((state) => state.auth);
  console.log('aaaaaaa',adminData);
  

  // Redirect to login if admin is not authenticated
  return adminData ? children : <Navigate to="/adminLogin" />;
};

export default AdminProtectedRoute;


