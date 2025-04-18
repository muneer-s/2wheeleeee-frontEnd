import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Apps/store";
import { deleteSelectedBike, fetchBikeData, removeOfferFromBike } from "../../../Api/host";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { handleApiResponse } from "../../../Utils/apiUtils";
import UserOrderList from "../HostOrderList/OrderList";
import CreateOffer from "../OfferCreate.tsx/CreateOffer";
import ViewOffers from "../ViewOffers/ViewOffers";
import { logout } from "../../../Api/user";
import { userLogout } from "../../../Apps/slice/AuthSlice";
import { useDispatch } from "react-redux";

const HostListView = () => {
    const [activeTab, setActiveTab] = useState<string>("Bike Details");
    const [bikes, setBikes] = useState<any[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const authState = useAppSelector((state) => state.auth);
    const userId = authState?.user?.userId;
    const userEmail = authState?.user?.email;

    useEffect(() => {
        const fetchBikeDatas = async () => {
            setIsLoading(true);
            try {
                const response = await fetchBikeData(userId);
                const data = handleApiResponse(response);
                setBikes(data.userAndbikes);
            } catch (error:any) {
                console.error("Error fetching bike data:", error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error(error.response.data.message);
                    await logout({ email: userEmail });
                    dispatch(userLogout());
                } else {
                    toast.error(error.response?.data?.message || "Failed to fetch bike data");
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        if (userId) {
            fetchBikeDatas();
        }
    }, [userId, userEmail, dispatch]);

    const removeOffer = async (bikeId: string) => {
        try {
            const result = await Swal.fire({
                title: 'Remove Offer?',
                text: 'This action cannot be undone',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                background: '#f8fafc',
            
            });

            if (result.isConfirmed) {
                const response = await removeOfferFromBike(bikeId);

                if (response.success) {
                    toast.success(response.message);
                    setBikes((prevBikes) =>
                        prevBikes.map((bike) =>
                            bike._id === bikeId ? { ...bike, offerApplied: false } : bike
                        )
                    );
                }
            }
        } catch (error: any) {
            console.error("Error removing offer:", error);
            toast.error(error.response?.data?.message || "Failed to remove offer");
        }
    };

    const deleteBike = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Bike?',
                text: 'This action cannot be undone',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                background: '#f8fafc',
                
            });

            if (result.isConfirmed) {
                const deleteResponse = await deleteSelectedBike(id);

                if (deleteResponse.success) {
                    toast.success(deleteResponse.message);
                    setBikes((prevBikes) => prevBikes.filter((bike) => bike._id !== id));
                } else {
                    toast.error("Error while deleting bike");
                }
            }
        } catch (error) {
            console.error("Error deleting bike:", error);
            toast.error("An error occurred while deleting the bike.");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Bike Details":
                return (
                    <div className="mb-8 transition-all duration-300 ease-in-out">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Your Bikes</h2>
                            <button 
                                onClick={() => navigate("/hostBikeRegister")}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add New Bike
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : bikes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bikes.map((bike) => (
                                    <div
                                        key={bike._id}
                                        className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={bike.images[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                                                alt={bike.modelName}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                            {bike.offerApplied && (
                                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                                    Special Offer
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4 flex-grow">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{bike.modelName}</h3>
                                            <div className="flex items-center text-gray-600 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                                <span className="text-sm">{bike.registerNumber}</span>
                                            </div>
                                            
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm">
                                                    <span className="text-gray-500 w-24">Insurance:</span>
                                                    <span className="font-medium text-gray-700">
                                                        {new Date(bike.insuranceExpDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <span className="text-gray-500 w-24">Pollution:</span>
                                                    <span className="font-medium text-gray-700">
                                                        {new Date(bike.polutionExpDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-4 border-t border-gray-100">
                                            <div className="grid grid-cols-1 gap-2">
                                                <button
                                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                                                    onClick={() => navigate(`/HostBikeViewPage/${bike._id}`)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                    View Details
                                                </button>
                                                
                                                {bike.isEdit && (
                                                    <button
                                                        className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                                                        onClick={() => navigate(`/EditBike/${bike._id}`)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                        Edit Doc
                                                    </button>
                                                )}
                                                
                                                <button
                                                    className={`col-span-2 px-3 py-2 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center
                                                        ${bike.offerApplied 
                                                            ? "bg-green-600 hover:bg-green-700" 
                                                            : "bg-purple-600 hover:bg-purple-700"}`}
                                                    onClick={() => bike.offerApplied ? removeOffer(bike._id) : navigate(`/applyOffer/${bike._id}`)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
                                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                                                    </svg>
                                                    {bike.offerApplied ? "Remove Offer" : "Apply Offer"}
                                                </button>
                                                
                                                <button
                                                    className="col-span-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                                                    onClick={() => deleteBike(bike._id)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Delete Bike
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <p className="text-gray-600 text-lg">No bikes found for this user.</p>
                                <button 
                                    onClick={() => navigate("/hostBikeRegister")}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center"
                                >
                                    Add Your First Bike
                                </button>
                            </div>
                        )}
                    </div>
                );

            case "Add":
                navigate("/hostBikeRegister");
                return null;
                
            case "Orders":
                return <UserOrderList />;
                
            case "Add Offers":
                return <CreateOffer />;
                
            case "View Offers":
                return <ViewOffers />;
                
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4 mt-10">
            <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex relative">
                    {/* Mobile Nav Toggle */}
                    <div className="md:hidden p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-800">Host Dashboard</h1>
                        <button
                            className="p-2 rounded-lg bg-blue-600 text-white"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Sidebar */}
                    <div 
                        className={`${
                            isSidebarOpen ? "block" : "hidden"
                        } md:block w-full md:w-64 bg-gray-50 md:bg-gradient-to-br md:from-blue-700 md:to-blue-900 transition-all duration-300 ease-in-out`}
                    >
                        <div className="p-6 md:p-8">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 md:text-white mb-8 hidden md:block">Host Dashboard</h1>
                            <ul className="space-y-2">
                                {[
                                    {
                                        name: "Bike Details",
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: "Add",
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: "Orders",
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: "Add Offers",
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: "View Offers",
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )
                                    }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <button
                                            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                                activeTab === item.name
                                                    ? "bg-blue-100 md:bg-white text-blue-800 md:text-blue-900 font-semibold"
                                                    : "text-gray-700 md:text-white hover:bg-blue-50 md:hover:bg-white/10"
                                            }`}
                                            onClick={() => {
                                                setActiveTab(item.name);
                                                setIsSidebarOpen(false);
                                            }}
                                        >
                                            <span className="mr-3">{item.icon}</span>
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full flex-1 p-4 md:p-8 overflow-auto max-h-screen">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostListView;