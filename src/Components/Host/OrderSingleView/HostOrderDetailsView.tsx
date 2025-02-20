import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../User/Header/Header";
import { userGetOrderDetails } from "../../../Api/user";
import { hostCompleteOrder, hostGetOrderDetails } from "../../../Api/host";
import ChatWidget from "../../User/Chat/MainChatUI"
import Api from "../../../service/axios";
import { useAppSelector } from "../../../Apps/store";
import { Socket } from "socket.io-client";
import io from 'socket.io-client';


const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['polling', 'websocket'],
})



interface IOrder {
    startDate: string;
    endDate: string;
    amount: number;
    method: string;
    status: string;
}

interface IBike {
    images: string[];
    modelName: string;
}

interface OrderFCProps {
    socket: typeof Socket;
}

interface IUser {
    _id:string
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


    const HostOrderDetailsView  = () => {

    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState<IOrderResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");


    const authState = useAppSelector((state) => state.auth);
      const userDetails = authState.user
      const ownerId = userDetails.userId

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                toast.error("Invalid order ID");
                return;
            }
            try {
                const response = await hostGetOrderDetails(orderId);
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


    const buttonTrigger = (userId: string) => {
        setUserId(userId);
        Api
            .post("/chat/accesschat", { receiverId: userId, senderId: ownerId })
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

    const handleCompleteOrder = async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            const response = await hostCompleteOrder(orderId);
            if (response?.success) {
                toast.success("Order marked as completed!");
                setOrderDetails((prev) => prev ? { ...prev, order: { ...prev.order, status: "Completed" } } : prev);
            } else {
                toast.error("Failed to update order status.");
            }
        } catch (error: any) {
            toast.error("Error updating order status.");
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!orderDetails) {
        return <p className="text-center text-gray-600 mt-10">Loading order details...</p>;
    }

    const { order, bike, user } = orderDetails;

    const statusColors: Record<string, string> = {
        "Pending": "bg-yellow-500",
        "Early Return": "bg-blue-500",
        "Return": "bg-purple-500",
        "Completed": "bg-green-500",

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
                        </tbody>
                    </table>
                    {/* Show Complete Button if order is "Early Return" or "Return" */}
                    {["Early Return", "Return"].includes(order.status) && (
                        <button
                            onClick={handleCompleteOrder}
                            className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? "Completing..." : "Mark as Completed"}
                        </button>
                    )}


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
                <div className="grid md:grid-cols-2 gap-6">


                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">User Details</h2>
                        <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
                        <p className="text-gray-700"><strong>Phone:</strong> {user.phoneNumber}</p>
                        <p className="text-gray-700"><strong>Address:</strong> {user.address}</p>
                        
                                    <button
                                        className="px-2 py-2 rounded bg-red-500 text-white flex items-center"
                                        onClick={() =>
                                            buttonTrigger(user._id)
                                        }
                                    >
                                        Connect Host
                                    </button>
                               
                    </div>

                    {isOpen ? (
                    <ChatWidget
                        isChatOpen={isOpen}
                        onClose={handleClose}
                        hostId={userId}
                        chatId={chatId}
                        socket={socket}
                    />
                ) : (
                    ""
                )}


                </div>

            </div>
        </div>

    );
};

export default HostOrderDetailsView;
