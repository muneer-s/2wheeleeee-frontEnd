
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteSelectedBike, singleBikeView } from "../../../api/host";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';


interface Bike {
    companyName: string;
    modelName: string;
    images: string[];
    registerNumber: string;
    fuelType: string;
    rentAmount: number;
    insuranceExpDate: string | number | Date;
    polutionExpDate: string | number | Date;
    rcImage: string;
    insuranceImage: string;
    PolutionImage: string;
    isHost: boolean;


}


const BikeSingleView = () => {
    const { id } = useParams(); // Get the bike ID from the URL
    const navigate = useNavigate();
    const [bike, setBike] = useState<Bike | null>(null); // Use the Bike interface

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch bike details from the backend
        const fetchBikeDetails = async () => {
            try {
                const response = await singleBikeView(id as string);
                setBike(response.bike);
            } catch (err) {
                setError("Failed to fetch bike details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBikeDetails();
    }, [id]);



    const deleteBike = async () => {
        try {
            // Show confirmation dialog using SweetAlert2
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you really want to delete this bike?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true,
            });

            // If the user confirms, proceed with the deletion
            if (result.isConfirmed) {
                const deleteResponse = await deleteSelectedBike(id as string);

                if (deleteResponse.success) {
                    toast.success("Bike deleted successfully!");
                    navigate(-1); // Navigate back to the previous page
                } else {
                    toast.error("Error while deleting bike");
                }
            } else {
                toast.error("Bike deletion canceled");
            }
        } catch (error) {
            console.error("Error deleting bike:", error);
            toast.error("An error occurred while deleting the bike.");
        }
    };







    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p>Loading bike details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-200 flex justify-center items-center">
            <div className="w-full mt-4 mb-8 max-w-4xl bg-gradient-to-b from-white to-sky-300 rounded-lg shadow-lg p-8">
                {/* Header Section */}
                <h2 className="text-3xl font-bold mb-6 text-center">{bike?.companyName} - {bike?.modelName}</h2>

                {/* Image Gallery */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {bike?.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Bike Image ${index + 1}`}
                            className="w-auto h-48 object-cover rounded-lg shadow-md border"
                        />
                    ))}
                </div>

                {/* Bike Details */}
                <div className="mt-6 space-y-4">

                    <div className="bg-gradient-to-r from-sky-200 via-white to-sky-200 p-6 rounded-lg shadow-lg mt-6">
                        <h3 className="text-2xl font-semibold text-center mb-4">Bike Details</h3>
                        <div className="space-y-4">
                            <p className="text-lg"><strong>Register Number:</strong> {bike?.registerNumber}</p>
                            <p className="text-lg"><strong>Fuel Type:</strong> {bike?.fuelType}</p>
                            <p className="text-lg"><strong>Rent Amount:</strong> ₹{bike?.rentAmount} per day</p>
                            <p className="text-lg">
                                <strong>Insurance Expiry Date:</strong>
                                {bike?.insuranceExpDate ? new Date(bike?.insuranceExpDate).toLocaleDateString() : "N/A"}
                                {bike?.insuranceExpDate && new Date(bike.insuranceExpDate) < new Date() && (
                                    <span className="text-red-500 ml-2">Expired</span>
                                )}
                            </p>

                            <p className="text-lg">
                                <strong>Pollution Expiry Date:</strong>
                                {bike?.polutionExpDate ? new Date(bike?.polutionExpDate).toLocaleDateString() : "N/A"}
                                {bike?.polutionExpDate && new Date(bike.polutionExpDate) < new Date() && (
                                    <span className="text-red-500 ml-2">Expired</span>
                                )}
                            </p>

                            {bike?.isHost ? (
                                <p className="text-green-600">Bike Verified by the admin</p>
                            ) : (
                                <p className="text-red-600">Bike is not verified</p>
                            )}


                        </div>
                    </div>



                    <div className="flex justify-center gap-8 mt-6">
                        <div className="flex flex-col items-center">
                            <strong>RC Image:</strong>
                            <img
                                src={bike?.rcImage}
                                alt="RC Document"
                                className="w-auto h-64 object-cover rounded-lg mt-2 border shadow-md"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <strong>Insurance Image:</strong>
                            <img
                                src={bike?.insuranceImage}
                                alt="Insurance Document"
                                className="w-auto h-64 object-cover rounded-lg mt-2 border shadow-md"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <strong>Polution Image:</strong>
                            <img
                                src={bike?.PolutionImage}
                                alt="Insurance Document"
                                className="w-auto h-64 object-cover rounded-lg mt-2 border shadow-md"
                            />
                        </div>
                    </div>



                </div>

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-blue-600"
                    >
                        Go Back
                    </button>

                    <button
                        onClick={deleteBike}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                    >
                        Delete
                    </button>
                </div>


            </div>
        </div>
    );
};

export default BikeSingleView;
