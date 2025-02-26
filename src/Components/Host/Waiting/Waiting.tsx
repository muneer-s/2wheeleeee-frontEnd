import { useNavigate } from "react-router-dom";

const Waiting = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-200 via-white to-sky-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center border-t-4 border-sky-400">
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-sky-400 animate-bounce"
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

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Approval Pending
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your account is currently awaiting admin approval. Once approved, you
          can enjoy all the features as a Host. Thank you for your patience!
        </p>

        {/* Go Home Button */}
        <button
          onClick={handleGoHome}
          className="px-8 py-3 bg-sky-500 text-white font-semibold rounded-full shadow-lg hover:bg-sky-600 focus:outline-none transition-all duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default Waiting;
