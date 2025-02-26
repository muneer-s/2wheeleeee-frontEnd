import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/hostBikeListPage");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-sky-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          {/* Success Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-sky-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Submission Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you! Your submission has been received successfully.
        </p>
        <button
          onClick={handleGoHome}
          className="px-6 py-2 bg-sky-400 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 focus:outline-none"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Success;
