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

    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user;
    const userId = userDetails?.userId;

    useEffect(() => {
        const fetchFeedback = async () => {
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

        try {
            const updatedFeedback = { rating, comment };
            const response = await updateFeedback(feedback._id, updatedFeedback);
console.log(11,response);

            toast.success(response.message);
            setFeedback({ ...feedback, rating, comment });
        } catch (error: any) {
            console.error("Error updating feedback", error);
            toast.error(error.response?.data?.message || "Failed to update feedback");
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
            try {
                await deleteFeedback(feedback._id);
                toast.success("Feedback deleted successfully");
                setFeedback(null);
                setRating(0);
                setComment("");
            } catch (error: any) {
                console.error("Error deleting feedback", error);
                toast.error(error.response?.data?.message || "Failed to delete feedback");
            }
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">{feedback ? "My Feedback" : "Leave Feedback"}</h2>

            <form onSubmit={feedback ? handleUpdate : handleSubmit}>
                {/* Star Rating */}
                <label className="block mt-2">Rating:</label>
                <div className="flex space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            size={24}
                            className={`cursor-pointer transition-colors ${
                                (hover !== null ? hover >= star : rating >= star) ? "text-yellow-500" : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                        />
                    ))}
                </div>

                {/* Error message for rating */}
                {error && !comment.trim() && rating < 1 && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}

                <label className="block mt-2">Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-2 w-96 h-40 rounded-lg"
                />

                {/* Error message for comment */}
                {error && !comment.trim() && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}

                <div className="flex space-x-2 mt-3">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        {feedback ? "Update" : "Submit"}
                    </button>
                    {feedback && (
                        <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                            Delete
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
