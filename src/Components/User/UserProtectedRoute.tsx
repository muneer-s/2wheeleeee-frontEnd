import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ children }) => {
  const { userData } = useAppSelector((state) => state.auth);

  return userData ? <>{children}</> : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;
