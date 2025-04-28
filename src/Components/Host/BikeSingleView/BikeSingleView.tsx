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
    const [activeImage, setActiveImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await singleBikeView(id as string);
                const data = handleApiResponse(response);
                setBike(data.bike);
                if (data.bike.images && data.bike.images.length > 0) {
                    setActiveImage(data.bike.images[0]);
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
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading bike details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-800 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="lg:flex">
                    {/* Left side - Image Gallery */}
                    <div className="lg:w-1/2 bg-gray-50">
                        <div className="h-80 sm:h-96 lg:h-full overflow-hidden">
                            {activeImage && (
                                <img
                                    src={activeImage}
                                    alt="Featured bike"
                                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                                />
                            )}
                        </div>
                        <div className="p-4 bg-white">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {bike?.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Bike thumbnail ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                                            activeImage === image ? 'border-blue-500' : 'border-transparent'
                                        }`}
                                        onClick={() => setActiveImage(image)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Bike Details */}
                    <div className="lg:w-1/2 p-6 lg:p-8">
                        <div className="flex justify-between items-start">
                            <h2 className="text-3xl font-bold text-gray-800">
                                {bike?.companyName} {bike?.modelName}
                            </h2>
                            <div className="flex items-center">
                                {bike?.isHost ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Not Verified
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-xl font-bold text-blue-600 ml-2">₹{bike?.rentAmount}</span>
                                <span className="text-gray-500 ml-1">per day</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Bike Specifications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Fuel Type</p>
                                            <p className="font-medium">{bike?.fuelType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Register Number</p>
                                            <p className="font-medium">{bike?.registerNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Insurance Expiry</p>
                                            <p className={`font-medium ${bike?.insuranceExpDate && new Date(bike.insuranceExpDate) < new Date() ? 'text-red-600' : ''}`}>
                                                {bike?.insuranceExpDate ? new Date(bike?.insuranceExpDate).toLocaleDateString() : "N/A"}
                                                {bike?.insuranceExpDate && new Date(bike.insuranceExpDate) < new Date() && " (Expired)"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Pollution Expiry</p>
                                            <p className={`font-medium ${bike?.polutionExpDate && new Date(bike.polutionExpDate) < new Date() ? 'text-red-600' : ''}`}>
                                                {bike?.polutionExpDate ? new Date(bike?.polutionExpDate).toLocaleDateString() : "N/A"}
                                                {bike?.polutionExpDate && new Date(bike.polutionExpDate) < new Date() && " (Expired)"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Documents</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                                        <p className="text-sm font-medium text-gray-700 mb-2">RC Document</p>
                                        <div className="h-36 overflow-hidden rounded-md">
                                            <img
                                                src={bike?.rcImage}
                                                alt="RC Document"
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Insurance Document</p>
                                        <div className="h-36 overflow-hidden rounded-md">
                                            <img
                                                src={bike?.insuranceImage}
                                                alt="Insurance Document"
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Pollution Document</p>
                                        <div className="h-36 overflow-hidden rounded-md">
                                            <img
                                                src={bike?.PolutionImage}
                                                alt="Pollution Document"
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center justify-center px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Go Back
                                </button>
                                
                                {bike?.isEdit && (
                                    <button
                                        onClick={() => navigate(`/EditBike/${bike?._id}`)}
                                        className="flex items-center justify-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Docs
                                    </button>
                                )}
                                
                                <button
                                    onClick={deleteBike}
                                    className="flex items-center justify-center px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BikeSingleView;