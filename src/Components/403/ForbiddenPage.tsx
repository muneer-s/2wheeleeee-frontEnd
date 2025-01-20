import React from 'react';
import { Link } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <h2 className="text-2xl font-semibold mt-4">Access Forbidden</h2>
        <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
        <Link to="/" className="mt-6 inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-500">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;