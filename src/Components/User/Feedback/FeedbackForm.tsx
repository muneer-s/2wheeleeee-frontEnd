import { useState } from "react";
import { useAppSelector } from "../../../Apps/store";
import { FaStar } from "react-icons/fa"; // Import FontAwesome Star Icon
import toast from "react-hot-toast";
import { createFeedback } from "../../../Api/user";

interface FeedbackFormProps {
    role: string;
}

export interface IUserFeedback {
    userId: string,
    role: string,
    rating: number,
    comment: string
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ role }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user;
    const userId = userDetails?.userId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || !comment.trim()) {
            setError("Both rating and comment are required.");
            return;
        }

        try {

            const userFeedback: IUserFeedback = {
                userId,
                role,
                rating,
                comment
            }

            const response = await createFeedback(userFeedback)
            console.log("response from create feedback : ", response);
            toast.success(response.message)
            setComment("");
            setRating(0);
            setError("");
        } catch (error:any) {
            console.error("Error submitting feedback", error);
            toast.error(error.response.data.message)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Leave Feedback</h2>

            {/* Star Rating */}
            <label className="block mt-2">Rating:</label>
            <div className="flex space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={24}
                        className={`cursor-pointer transition-colors ${(hover !== null ? hover >= star : rating >= star) ? "text-yellow-500" : "text-gray-300"
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

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-3">Submit</button>
        </form>
    );
};

export default FeedbackForm;
