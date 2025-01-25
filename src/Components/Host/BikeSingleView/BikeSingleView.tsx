
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteSelectedBike, singleBikeView } from "../../../Api/host";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { IBike } from "../../../Interfaces/Host/IHost";




const BikeSingleView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState<IBike | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

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
                    toast.success("Bike deleted successfully!");
                    navigate(-1);
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
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-200 flex justify-center items-center p-4">
            <div className="w-full mt-4 mb-8 max-w-4xl bg-gradient-to-b from-white to-sky-300 rounded-lg shadow-lg p-6 sm:p-8">
                {/* Header Section */}
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                    {bike?.companyName} - {bike?.modelName}
                </h2>

                {/* Image Gallery */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {bike?.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Bike Image ${index + 1}`}
                            className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-lg shadow-md border"
                        />
                    ))}
                </div>

                {/* Bike Details */}
                <div className="mt-6 space-y-4">

                    <div className="bg-gradient-to-r from-sky-200 via-white to-sky-200 p-4 sm:p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4">
                            Bike Details
                        </h3>
                        <div className="space-y-4">
                            <p className="text-sm sm:text-lg">
                                <strong>Register Number:</strong> {bike?.registerNumber}
                            </p>
                            <p className="text-sm sm:text-lg">
                                <strong>Fuel Type:</strong> {bike?.fuelType}
                            </p>
                            <p className="text-sm sm:text-lg">
                                <strong>Rent Amount:</strong> ₹{bike?.rentAmount} per day
                            </p>

                            <p className="text-sm sm:text-lg">
                                <strong>Insurance Expiry Date:</strong>{" "}
                                {bike?.insuranceExpDate ? new Date(bike?.insuranceExpDate).toLocaleDateString() : "N/A"}
                                {bike?.insuranceExpDate && new Date(bike.insuranceExpDate) < new Date() && (
                                    <span className="text-red-500 ml-2">Expired</span>
                                )}
                            </p>

                            <p className="text-sm sm:text-lg">
                                <strong>Pollution Expiry Date:</strong>{" "}
                                {bike?.polutionExpDate ? new Date(bike?.polutionExpDate).toLocaleDateString() : "N/A"}
                                {bike?.polutionExpDate && new Date(bike.polutionExpDate) < new Date() && (
                                    <span className="text-red-500 ml-2">Expired</span>
                                )}
                            </p>

                            {bike?.isHost ? (
                                <p className="text-green-600 text-sm sm:text-lg">Bike Verified by the admin</p>
                            ) : (
                                <p className="text-red-600 text-sm sm:text-lg">Bike is not verified</p>
                            )}







                        </div>
                    </div>


                    {/* Document Images */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        <div className="flex flex-col items-center">
                            <strong>RC Image:</strong>
                            <img
                                src={bike?.rcImage}
                                alt="RC Document"
                                className="w-full h-auto sm:h-64 object-cover rounded-lg mt-2 border shadow-md"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <strong>Insurance Image:</strong>
                            <img
                                src={bike?.insuranceImage}
                                alt="Insurance Document"
                                className="w-full h-auto sm:h-64 object-cover rounded-lg mt-2 border shadow-md"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <strong>Polution Image:</strong>
                            <img
                                src={bike?.PolutionImage}
                                alt="Insurance Document"
                                className="w-full h-auto sm:h-64 object-cover rounded-lg mt-2 border shadow-md"
                            />
                        </div>


                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-blue-600"
                    >
                        Go Back
                    </button>

                    <button
                        onClick={deleteBike}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                    >
                        Delete
                    </button>
                    {/* {bike?.isEdit && ( */}
                    <button
                        className=" px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={() => navigate(`/EditBike/${bike?._id}`)}
                    >
                        Edit
                    </button>
                    {/* )} */}

                </div>


            </div>
        </div>
    );
};

export default BikeSingleView;
