import { useEffect, useState } from "react";
import { useAppSelector } from "../../../Apps/store";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { createFeedback, deleteFeedback, getUserFeedback, updateFeedback } from "../../../Api/user";
import Swal from "sweetalert2";

export interface IUserFeedbacks {
    userId: string;
    rating: number;
    comment: string;
}

export interface IUserFeedback {
    _id: string;
    rating: number;
    comment: string;
}

const FeedbackForm = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState<number | null>(null);
    const [error, setError] = useState<string>("");
    const [feedback, setFeedback] = useState<IUserFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user;
    const userId = userDetails?.userId;

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoading(true);
            try {
                const response = await getUserFeedback(userId);

                if (response.success && response.data) {
                    setFeedback(response.data);
                    setRating(response.data.rating);
                    setComment(response.data.feedback);
                }
            } catch (error: any) {
                console.error("Error fetching feedback", error);
                toast.error(error.response?.data?.message || "Failed to fetch feedback");
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchFeedback();
        }
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || !comment.trim()) {
            setError("Both rating and comment are required.");
            return;
        }

        setIsLoading(true);
        try {
            const userFeedback: IUserFeedbacks = {
                userId,
                rating,
                comment,
            };

            const response = await createFeedback(userFeedback);
            toast.success(response.message);
            setFeedback(response.data);
        } catch (error: any) {
            console.error("Error submitting feedback", error);
            toast.error(error.response?.data?.message || "Failed to submit feedback");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || !comment.trim()) {
            setError("Both rating and comment are required.");
            return;
        }

        if (!feedback?._id) {
            toast.error("Feedback ID is undefined");
            return;
        }

        setIsLoading(true);
        try {
            const updatedFeedback = { rating, comment };
            const response = await updateFeedback(feedback._id, updatedFeedback);
            toast.success(response.message);
            setFeedback({ ...feedback, rating, comment });
        } catch (error: any) {
            console.error("Error updating feedback", error);
            toast.error(error.response?.data?.message || "Failed to update feedback");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!feedback?._id) return;

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
            setIsLoading(true);
            try {
                await deleteFeedback(feedback._id);
                toast.success("Feedback deleted successfully");
                setFeedback(null);
                setRating(0);
                setComment("");
            } catch (error: any) {
                console.error("Error deleting feedback", error);
                toast.error(error.response?.data?.message || "Failed to delete feedback");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getRatingText = () => {
        const ratingTexts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
        return rating > 0 ? ratingTexts[rating] : "";
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                    {feedback ? "Your Feedback" : "Share Your Experience"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                    {feedback ? "Update or delete your existing feedback" : "Tell us what you think about our service"}
                </p>
            </div>

            <div className="p-6">
                <form onSubmit={feedback ? handleUpdate : handleSubmit} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">How would you rate your experience?</label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={28}
                                    className={`cursor-pointer transition-colors duration-200 ${
                                        (hover !== null ? hover >= star : rating >= star) 
                                            ? "text-yellow-400" 
                                            : "text-gray-300"
                                    }`}
                                    onClick={() => {
                                        setRating(star);
                                        setError("");
                                    }}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            ))}
                            {(hover || rating) > 0 && (
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                    {hover ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hover] : getRatingText()}
                                </span>
                            )}
                        </div>
                        {error && rating < 1 && (
                            <p className="text-red-500 text-xs mt-1">Please select a rating</p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Your comments
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                                setError("");
                            }}
                            placeholder="Tell us about your experience..."
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        {error && !comment.trim() && (
                            <p className="text-red-500 text-xs mt-1">Please provide a comment</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${
                                isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? (
                                <span>Processing...</span>
                            ) : feedback ? (
                                "Update Feedback"
                            ) : (
                                "Submit Feedback"
                            )}
                        </button>
                        
                        {feedback && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className={`bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium py-2 px-4 rounded-md transition-colors ${
                                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;