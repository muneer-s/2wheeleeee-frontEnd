import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../Header/Header";
import { earlyReturns, returnOrder, submitReview, userGetOrderDetails } from "../../../Api/user";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa";
import { useAppSelector } from "../../../Apps/store";

interface IOrder {
    _id: string;
    startDate: string;
    endDate: string;
    amount: number;
    method: string;
    status: string;
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

const UserOrderDetails = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState<IOrderResponse | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("order");

    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user;
    const userId = userDetails.userId;

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
                }
            } catch (error: any) {
                toast.error(error.response.data.message || "Error fetching order details...")
                console.error("Error:", error.message);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                    <p className="text-gray-600 mt-4 font-medium">Loading order details...</p>
                </div>
            </div>
        );
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
                confirmButtonText: "Yes, return!",
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
                setRating(0);
                setFeedback("");
            } else {
                toast.error("Failed to submit review.");
            }
        } catch (error: any) {
            console.error("Error submitting review:", error);
            toast.error(error.response.data.message);
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const renderActionButton = () => {
        const endDate = new Date(order.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (endDate > today) {
            return (
                <button
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center"
                    onClick={() => handleEarlyReturn(order._id)}
                >
                    <span>Early Return</span>
                </button>
            );
        } else {
            return (
                <div className="flex flex-col gap-2">
                    {endDate.getTime() < today.getTime() && (
                        <p className="text-red-500 font-medium text-sm">Date Expired</p>
                    )}
                    <button
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md flex items-center justify-center"
                        onClick={() => handleReturn(order._id)}
                    >
                        <span>Return Now</span>
                    </button>
                </div>
            );
        }
    };

    return (
        // <div className="min-h-screen bg-gray-50">
        <><Header />
            
        <div className="max-w-5xl mx-auto p-4 sm:p-6 pt-12 mt-20">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Order header */}
                <div className="bg-gray-800 text-white p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Order #{order._id.substring(order._id.length - 6)}</h1>
                            <p className="text-gray-300 mt-1">Booked on {formatDate(order.startDate)}</p>
                        </div>
                        <span className={`mt-3 md:mt-0 px-4 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-500"}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="border-b">
                    <nav className="flex">
                        <button 
                            onClick={() => setActiveTab("order")}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "order" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Order Details
                        </button>
                        <button 
                            onClick={() => setActiveTab("bike")}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "bike" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Bike Information
                        </button>
                        <button 
                            onClick={() => setActiveTab("owner")}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "owner" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Owner Details
                        </button>
                        {orderDetails?.order.status === "Completed" && (
                            <button 
                                onClick={() => setActiveTab("review")}
                                className={`px-4 py-3 text-sm font-medium ${activeTab === "review" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Leave Review
                            </button>
                        )}
                    </nav>
                </div>
                
                {/* Content based on active tab */}
                <div className="p-6">
                    {activeTab === "order" && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Rental Information</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span className="text-gray-600">Start Date</span>
                                            <span className="font-medium">{formatDate(order.startDate)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span className="text-gray-600">End Date</span>
                                            <span className="font-medium">{formatDate(order.endDate)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span className="text-gray-600">Total Days</span>
                                            <span className="font-medium">
                                                {Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span className="text-gray-600">Amount</span>
                                            <span className="font-medium text-lg">₹{order.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span className="text-gray-600">Payment Method</span>
                                            <span className="font-medium">{order.method}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {order.status === "Booked" && (
                                <div className="mt-8 flex justify-center">
                                    {renderActionButton()}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === "bike" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bike Information</h2>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/2">
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        {bike.images.length > 0 ? (
                                            <img 
                                                src={bike.images[0]} 
                                                alt={bike.modelName} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No image available
                                            </div>
                                        )}
                                    </div>
                                    
                                    {bike.images.length > 1 && (
                                        <div className="mt-3 grid grid-cols-4 gap-2">
                                            {bike.images.slice(1, 5).map((img, index) => (
                                                <img 
                                                    key={index} 
                                                    src={img} 
                                                    alt={`Bike ${index + 1}`} 
                                                    className="w-full aspect-square object-cover rounded-md"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-xl font-bold text-gray-800">{bike.modelName}</h3>
                                        <div className="mt-4 space-y-2">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Bike ID:</span> {bike._id}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Rental Period:</span> {formatDate(order.startDate)} - {formatDate(order.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "owner" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bike Owner Information</h2>
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {owner.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">{owner.name}</h3>
                                        <p className="text-gray-500 text-sm">Bike Owner</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-start">
                                        <div className="min-w-24 text-gray-600">Phone:</div>
                                        <div className="font-medium">{owner.phoneNumber}</div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="min-w-24 text-gray-600">Address:</div>
                                        <div className="font-medium">{owner.address}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "review" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave Your Review</h2>
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <p className="text-gray-600 mb-4">How was your experience with this bike?</p>
                                
                                <div className="flex mb-6">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <FaStar
                                                key={index}
                                                className={`cursor-pointer transition duration-200 ${starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
                                                size={32}
                                                onMouseEnter={() => setHover(starValue)}
                                                onMouseLeave={() => setHover(0)}
                                                onClick={() => setRating(starValue)}
                                            />
                                        );
                                    })}
                                    <span className="ml-3 text-gray-600">
                                        {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                                    </span>
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your feedback
                                    </label>
                                    <textarea
                                        id="feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Share your experience with this bike and the rental service..."
                                    ></textarea>
                                </div>
                                
                                <button
                                    onClick={handleReviewSubmit}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
            
    );
};

export default UserOrderDetails;