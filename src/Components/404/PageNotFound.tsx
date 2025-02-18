import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <div className="relative">
        <h1 className="text-8xl font-bold text-red-600 animate-bounce">404</h1>
        <p className="text-xl font-semibold mt-4 text-gray-800">Oops! Page not found.</p>
        <p className="mt-2 text-gray-600">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
