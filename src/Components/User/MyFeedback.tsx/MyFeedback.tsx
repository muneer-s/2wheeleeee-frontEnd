import { useState, useEffect } from "react";
import { useAppSelector } from "../../../Apps/store";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import {  updateFeedback, deleteFeedback, getUserFeedback } from "../../../Api/user";
import Swal from "sweetalert2";

export interface IUserFeedback {
    _id: string;
    rating: number;
    comment: string;
}

const MyFeedback = () => {
    const [feedback, setFeedback] = useState<IUserFeedback | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user;
    const userId = userDetails?.userId;

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await getUserFeedback(userId);
                
                if (response.success) {
                    setFeedback(response.data);
                    setRating(response.data.rating);
                    setComment(response.data.feedback);
                }
            } catch (error: any) {
                console.error("Error fetching feedback", error);
                toast.error("Failed to load feedback");
            }
        };

        if (userId) {
            fetchFeedback();
        }
    }, [userId]);

    // Handle feedback update
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || !comment.trim()) {
            setError("Both rating and comment are required.");
            return;
        }

        if(!feedback?._id){
            toast.error("feedback id is undefined")
            return
        }

        try {
            const updatedFeedback = {
                rating,
                comment,
            };

            const response = await updateFeedback(feedback?._id, updatedFeedback);
            console.log(848,response);
            
            toast.success(response.message);
            setFeedback({ ...feedback, rating, comment } as IUserFeedback);
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
        <form onSubmit={handleUpdate} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">My Feedback</h2>

            {feedback ? (
                <>
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
                        className="border p-2 w-full rounded"
                    />

                    {/* Error message for comment */}
                    {error && !comment.trim() && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}

                    <div className="flex space-x-2 mt-3">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                        <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                    </div>
                </>
            ) : (
                <p className="text-gray-500">No feedback found</p>
            )}
        </form>
    );
};

export default MyFeedback;
