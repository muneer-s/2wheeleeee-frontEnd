import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../Header/Header";
import { earlyReturns, getReviews, returnOrder, submitReview, userGetOrderDetails } from "../../../Api/user";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa";
import { useAppSelector } from "../../../Apps/store";
import Api from "../../../service/axios";

import { Socket } from "socket.io-client";
// import ChatWidget from "../../../Components/User/Chat/ChatUi";
import io from 'socket.io-client';
import ChatWidget from "../Chat/MainChatUI";
import ChatWidget1 from "../Chat/ChatUi";



// const socket = io(import.meta.env.VITE_BACKEND_URL, {
//     transports: ['polling', 'websocket'],
// })

interface IOrder {
    _id: string;
    startDate: string;
    endDate: string;
    amount: number;
    method: string;
    status: string;
}

interface OrderFCProps {
    socket: typeof Socket;
}

interface IBike {
    _id: string
    images: string[];
    modelName: string;
}

interface IUser {
    _id: string;
    name: string;
    phoneNumber: number;
    address: string;
}

interface IOrderResponse {
    order: IOrder;
    bike: IBike;
    owner: IUser;
    user: IUser;
}
export interface IReview {
    reviewerName: string;
    rating: number;
    feedback: string;
    createdAt: string;
}

const UserOrderDetails: React.FC<OrderFCProps> = ({ socket }) => {


    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState<IOrderResponse | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [reviews, setReviews] = useState<IReview[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [hostId, setHostId] = useState("");
    const [chatId, setChatId] = useState("");


    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user
    const userId = userDetails.userId


    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                toast.error("Invalid order ID");
                return;
            }
            try {
                const response = await userGetOrderDetails(orderId);
                if (response?.success) {
                    setOrderDetails(response.data);
                } else {
                    toast.error("Failed to load order details");
                }
            } catch (error: any) {
                toast.error("Error fetching order details...");
                console.error("Error:", error.message);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const buttonTrigger = (hostId: string) => {
        setHostId(hostId);
        Api
            .post("/chat/accesschat", { receiverId: hostId, senderId: userId })
            .then((res) => {
                console.log(13, res.data.data);

                if (res.data) {
                    setChatId(res.data.data._id);
                    setIsOpen(true);
                }
            });
    };

    const handleClose = () => {
        setIsOpen(false);
    };



    if (!orderDetails) {
        return <p className="text-center text-gray-600 mt-10">Loading order details...</p>;
    }

    const { order, bike, owner } = orderDetails;

    const statusColors: Record<string, string> = {
        "Booked": "bg-yellow-500",
        "Completed": "bg-green-500",
        "Early Return": "bg-blue-500",
        "Return": "bg-blue-500"
    };


    const handleEarlyReturn = async (orderId: string) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You are about to return this order early!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, return early!",
            })

            if (result.isConfirmed) {
                const response = await earlyReturns(orderId)

                if (response.success) {
                    Swal.fire(
                        "Returned!",
                        "Order status updated to Early Return.",
                        "success"
                    ); setOrderDetails((prev) => prev ? { ...prev, order: { ...prev.order, status: "Early Return" } } : prev);
                } else {
                    Swal.fire(
                        "Failed!",
                        "Failed to update order status.",
                        "error"
                    );
                }
            }

        } catch (error) {
            Swal.fire(
                "Error!",
                "Something went wrong while processing the early return.",
                "error"
            );
            console.log(error);

        }
    }


    const handleReturn = async (orderId: string) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You are about to return this order!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, return !",
            })

            if (result.isConfirmed) {
                const response = await returnOrder(orderId)

                if (response.success) {
                    Swal.fire(
                        "Returned!",
                        "Order status updated to Return.",
                        "success"
                    ); setOrderDetails((prev) => prev ? { ...prev, order: { ...prev.order, status: "Return" } } : prev);
                } else {
                    Swal.fire(
                        "Failed!",
                        "Failed to update order status.",
                        "error"
                    );
                }
            }

        } catch (error) {
            Swal.fire(
                "Error!",
                "Something went wrong while processing the return.",
                "error"
            );
            console.log(error);

        }
    }

    const handleReviewSubmit = async () => {
        if (!rating) {
            toast.error("Please select a rating.");
            return;
        }

        try {
            const response = await submitReview({
                reviewerId: userId,
                bikeId: orderDetails?.bike._id,
                rating,
                feedback,
            });

            if (response?.success) {
                toast.success("Review submitted successfully!");
                // fetchReviews(orderDetails?.bike._id!);
                setRating(0);
                setFeedback("");
            } else {
                toast.error("Failed to submit review.");
            }
        } catch (error:any) {
            console.error("Error submitting review:", error);
            toast.error(error.response.data.message);
        }
    };



    return (
        <div>

            <Header />
            <div className="mt-10 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

                {/* Order Details */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Order Information</h2>
                    <table className="w-full text-gray-700">
                        <tbody>
                            <tr>
                                <td className="font-semibold py-1">Start Date:</td>
                                <td>{new Date(order.startDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold py-1">End Date:</td>
                                <td>{new Date(order.endDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold py-1">Amount:</td>
                                <td>₹{order.amount}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold py-1">Payment Method:</td>
                                <td>{order.method}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold py-1">Status:</td>
                                <td>
                                    <span className={`px-3 py-1 text-white text-sm rounded-full ${statusColors[order.status] || "bg-gray-500"}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                            {order.status == "Booked" && (
                                <tr>
                                    <td className="font-semibold py-1">Action:</td>
                                    <td>
                                        {(() => {
                                            const endDate = new Date(order.endDate);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            endDate.setHours(0, 0, 0, 0);

                                            if ((endDate > today)) {
                                                return (
                                                    <button
                                                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                        onClick={() => handleEarlyReturn(order._id)}
                                                    >
                                                        Early Return
                                                    </button>
                                                );
                                            } else if ((endDate.getTime() === today.getTime())) {
                                                return (
                                                    <button
                                                        className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                        onClick={() => handleReturn(order._id)}

                                                    >
                                                        Return
                                                    </button>
                                                );
                                            } else {
                                                return (
                                                    <div>
                                                        <p className="text-red-500 font-semibold">Date Expired</p>
                                                        <button
                                                            className="mt-2 ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                            onClick={() => handleReturn(order._id)}

                                                        >
                                                            Return
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </td>
                                </tr>
                            )}


                        </tbody>
                    </table>
                </div>

                {/* Bike Details */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Bike Information</h2>
                    <p className="text-gray-700"><strong>Model Name:</strong> {bike.modelName}</p>
                    <div className="flex space-x-3 mt-4 overflow-x-auto">
                        {bike.images.map((img, index) => (
                            <img key={index} src={img} alt={`Bike ${index + 1}`} className="w-32 h-32 object-cover rounded-lg shadow-md border" />
                        ))}
                    </div>
                </div>

                {/* Owner Details */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Bike Owner Details</h2>
                    <table className="w-full text-gray-700">
                        <tbody>
                            <tr>
                                <td className="font-semibold py-1">Name:</td>
                                <td>{owner.name}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold py-1">Phone:</td>
                                <td>{owner.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold py-1">Address:</td>
                                <td>{owner.address}</td>
                            </tr>
                            <tr>
                                <td>
                                    <button
                                        className="px-2 py-2 rounded bg-red-500 text-white flex items-center"
                                        onClick={() =>
                                            buttonTrigger(owner._id)
                                        }
                                    >
                                        Connect Host
                                    </button>
                                </td>

                            </tr>

                        </tbody>
                    </table>
                </div>



                {orderDetails?.order.status === "Completed" && (
                    <div className="bg-gray-300 p-4 rounded-lg mb-6 mt-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Rate Your Experience</h2>

                        {/* ⭐ Star Rating System */}
                        <div className="flex mb-4">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <FaStar
                                        key={index}
                                        className={`cursor-pointer transition duration-200 ${starValue <= (hover || rating) ? "text-yellow-500" : "text-gray-500"
                                            }`}
                                        size={30}
                                        onMouseEnter={() => setHover(starValue)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setRating(starValue)}
                                    />
                                );
                            })}
                        </div>

                        {/* ✍️ Feedback Text Area */}
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full h-24 p-2 border rounded-lg"
                            placeholder="Write your feedback here..."
                        ></textarea>

                        {/* ✅ Submit Button */}
                        <button
                            onClick={handleReviewSubmit}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Submit Review
                        </button>
                    </div>
                )}



                {/* {isOpen ? (
                    <ChatWidget
                        isChatOpen={isOpen}
                        onClose={handleClose}
                        hostId={hostId}
                        chatId={chatId}
                        socket={socket}
                    />
                ) : (
                    ""
                )} */}




                {isOpen ? (
                    <ChatWidget1
                        isChatOpen={isOpen}
                        onClose={handleClose}
                        hostId={hostId}
                        chatId={chatId}
                        socket={socket}
                    />
                ) : (
                    ""
                )}



            </div>
        </div>

    );
};

export default UserOrderDetails;
