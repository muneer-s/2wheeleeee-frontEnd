import { useNavigate } from 'react-router-dom';

export default function FallbackComponent({ error, resetErrorBoundary }: any) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-red-500 text-xl font-bold">Something went wrong!</h2>
      <pre className="text-red-400">{error?.message || "Unknown Error"}</pre>
      <button
        onClick={() => {
          resetErrorBoundary(); // Reset Error Boundary state
          navigate('/'); // Navigate to home
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Go Back Home
      </button>
    </div>
  );
}
