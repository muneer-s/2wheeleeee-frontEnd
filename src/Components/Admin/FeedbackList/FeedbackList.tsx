import { useEffect, useState } from "react";
import { deleteFeedback, getAllFeedbacks } from "../../../Api/admin";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export interface IFeedback {
  _id: string;
  userId: IUser;
  rating: number;
  feedback: string;
  createdAt: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
}

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await getAllFeedbacks();
        setFeedbacks(response.data);
      } catch (error: any) {
        console.error("Error fetching feedbacks", error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDeleteFeedback = async (feedbackId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteFeedback(feedbackId);
        toast.success(response.message);
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.filter((f) => f._id !== feedbackId)
        );
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete feedback"
        );
      }
    }
  };

  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-blue-50 to-blue-100",
      "from-purple-50 to-purple-100",
      "from-green-50 to-green-100",
      "from-pink-50 to-pink-100",
      "from-yellow-50 to-yellow-100",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Customer Feedback</h2>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {feedbacks.length} Reviews
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg">No feedback submissions yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={feedback._id}
              className={`bg-gradient-to-br ${getRandomGradient(
                index
              )} p-5 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <FaUserCircle className="text-gray-400 text-2xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">
                      {feedback.userId.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {feedback.userId.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        size={18}
                        className={`${
                          starIndex < feedback.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        } transition-colors duration-300`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg mb-4 text-gray-700">
                <p className="italic">{feedback.feedback}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleDeleteFeedback(feedback._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-300"
                >
                  <MdDelete size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;