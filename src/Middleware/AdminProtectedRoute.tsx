import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../Apps/store';

const AdminProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { adminData } = useAppSelector((state) => state.auth);
  return adminData ? children : <Navigate to="/adminLogin" />;
};

export default AdminProtectedRoute;


