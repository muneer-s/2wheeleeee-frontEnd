import { useEffect, useState } from "react";
import { deleteFeedback, getAllFeedbacks } from "../../../Api/admin"; // Adjust the path as needed
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import Swal from "sweetalert2";



export interface IFeedback {
    _id: string;
    userId: IUser;
    rating: number;
    feedback: string;
    createdAt: string;
}

interface IUser {
    _id: string
    name: string
    email: string
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
                setFeedbacks((prevFeedbacks) => prevFeedbacks.filter(f => f._id !== feedbackId));
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete feedback");
            }
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4">All Feedbacks</h2>

            {loading ? (
                <p>Loading...</p>
            ) : feedbacks.length === 0 ? (
                <p className="text-gray-500">No feedbacks found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">User</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Rating</th>
                                <th className="border px-4 py-2">Comment</th>
                                <th className="border px-4 py-2">Date</th>
                                <th className="border px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((feedback) => (
                                <tr key={feedback._id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{feedback.userId.name}</td>
                                    <td className="border px-4 py-2">{feedback.userId.email}</td>
                                    <td className="border px-4 py-2 flex justify-center space-x-1">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index}
                                                size={16}
                                                className={`${index < feedback.rating ? "text-yellow-500" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </td>
                                    <td className="border px-4 py-2">{feedback.feedback}</td>
                                    <td className="border px-4 py-2">{new Date(feedback.createdAt).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2">
                                        <Button variant="contained" color="error" onClick={() => handleDeleteFeedback(feedback._id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
