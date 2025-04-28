import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteSelectedBike, singleBikeView } from "../../../Api/host";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { IBike } from "../../../Interfaces/Host/IHost";
import { handleApiResponse } from "../../../Utils/apiUtils";

const BikeSingleView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState<IBike | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await singleBikeView(id as string);
                const data = handleApiResponse(response);
                setBike(data.bike);
                if (data.bike.images && data.bike.images.length > 0) {
                    setSelectedImage(data.bike.images[0]);
                }
            } catch (error: any) {
                setError("Failed to fetch bike details.");
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBikeDetails();
    }, [id]);

    const deleteBike = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you really want to delete this bike?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                const deleteResponse = await deleteSelectedBike(id as string);

                if (deleteResponse.success) {
                    toast.success(deleteResponse.message);
                    navigate(-1);
                } else {
                    toast.error("Error while deleting bike");
                }
            } else {
                toast.error("Bike deletion canceled");
            }
        } catch (error: any) {
            console.error("Error deleting bike:", error);
            toast.error(error.response.data.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-sky-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-blue-600 font-semibold">Loading bike details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-sky-50 to-blue-50 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-xl font-bold text-gray-800 mb-2">Error</p>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 py-16 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with Bike Name */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 inline-block bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                        {bike?.companyName} {bike?.modelName}
                    </h1>
                    {bike?.isHost ? (
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Verified by Admin
                        </div>
                    ) : (
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Pending Verification
                        </div>
                    )}
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Image Gallery - IMPROVED */}
                    <div className="relative">
                        <div className="h-96 overflow-hidden bg-gray-100">
                            {selectedImage && (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <img
                                        src={selectedImage}
                                        alt="Selected bike view"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}
                            {/* Price Badge */}
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                                <span className="text-sm font-medium">Daily Rate</span>
                                <p className="text-2xl font-bold">₹{bike?.rentAmount}</p>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex gap-3 overflow-x-auto py-2">
                                {bike?.images.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImage(image)}
                                        className={`cursor-pointer w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm transition-all duration-200 ${
                                            selectedImage === image ? 'ring-2 ring-blue-500 scale-105' : 'ring-1 ring-gray-200 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <img
                                                src={image}
                                                alt={`Bike view ${index + 1}`}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 sm:p-8">
                        {/* Bike Details */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Bike Details
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Details Cards */}
                                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Register Number</p>
                                                <p className="font-semibold text-gray-800">{bike?.registerNumber}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Fuel Type</p>
                                                <p className="font-semibold text-gray-800">{bike?.fuelType}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Insurance Expiry</p>
                                                <p className={`font-semibold ${bike?.insuranceExpDate && new Date(bike?.insuranceExpDate) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {bike?.insuranceExpDate ? new Date(bike?.insuranceExpDate).toLocaleDateString() : "N/A"}
                                                    {bike?.insuranceExpDate && new Date(bike.insuranceExpDate) < new Date() && (
                                                        <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Expired</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Pollution Expiry</p>
                                                <p className={`font-semibold ${bike?.polutionExpDate && new Date(bike?.polutionExpDate) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {bike?.polutionExpDate ? new Date(bike?.polutionExpDate).toLocaleDateString() : "N/A"}
                                                    {bike?.polutionExpDate && new Date(bike.polutionExpDate) < new Date() && (
                                                        <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Expired</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section - IMPROVED */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Document Images
                            </h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="group relative">
                                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-gray-100">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                src={bike?.rcImage}
                                                alt="RC Document"
                                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                            <span className="text-white font-medium p-3">RC Document</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="group relative">
                                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-gray-100">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                src={bike?.insuranceImage}
                                                alt="Insurance Document"
                                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                            <span className="text-white font-medium p-3">Insurance Document</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="group relative">
                                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-gray-100">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                src={bike?.PolutionImage}
                                                alt="Pollution Document"
                                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                            <span className="text-white font-medium p-3">Pollution Document</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Go Back
                            </button>

                            {bike?.isEdit && (
                                <button
                                    onClick={() => navigate(`/EditBike/${bike?._id}`)}
                                    className="flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Documents
                                </button>
                            )}

                            <button
                                onClick={deleteBike}
                                className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Bike
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BikeSingleView;