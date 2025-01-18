import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/store";
import { deleteSelectedBike, fetchBikeData } from "../../../api/host";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const HostListView = () => {

    const [activeTab, setActiveTab] = useState<string>("Bike Details");
    const [bikes, setBikes] = useState<any[]>([]); // State for storing bike data

    const navigate = useNavigate()

    // Get the logged-in user's details
    const authState = useAppSelector((state) => state.auth);
    const userId = authState?.user?.userId;

    useEffect(() => {
        const fetchBikeDatas = async () => {
            try {
                const response = await fetchBikeData(userId)
                console.log(11, response);

                setBikes(response.userAndbikes)

            } catch (error) {
                console.error("Error fetching bike data:", error);
            }
        };
        if (userId) {
            fetchBikeDatas()
        }
    }, [userId])




    const deleteBike = async (id: string) => {
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
                const deleteResponse = await deleteSelectedBike(id); // Pass the ID to the delete function

                if (deleteResponse.success) {
                    toast.success("Bike deleted successfully!");
                    setBikes((prevBikes) => prevBikes.filter((bike) => bike._id !== id)); // Remove the deleted bike from state
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







    const renderContent = () => {
        switch (activeTab) {
            case "Bike Details":
                return (
                    <div className="mb-8 h-auto ">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bike Details</h2>
                        {/*   sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-96 */}
                        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-96 ">
                            {bikes.length > 0 ? (
                                bikes.map((bike) => (
                                    <div
                                        key={bike._id} // Use a unique identifier here (like `_id`) instead of `index` for production
                                        className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                                    >
                                        <img
                                            src={bike.images[0] || "https://via.placeholder.com/150"} // Display the first image
                                            alt={bike.modelName}
                                            className="w-24 h-24 object-cover rounded-lg md:mr-4"
                                        />
                                        <div className="flex flex-col justify-between flex-grow">
                                            <h3 className="text-xl font-bold text-gray-800">{bike.modelName}</h3>
                                            <p className="text-sm text-gray-600">{bike.registerNumber}</p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Insurance Exp Date:</strong> {new Date(bike.insuranceExpDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Pollution Exp Date:</strong> {new Date(bike.polutionExpDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col mt-4 mb-2 md:mt-0 md:ml-4 space-y-2">
                                            <button
                                                className="w-24 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                onClick={() => navigate(`/HostBikeViewPage/${bike._id}`)}
                                            >
                                                View
                                            </button>

                                            {bike.isEdit && (
                                                <button
                                                    className="w-24 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                    onClick={() => navigate(`/EditBike/${bike._id}`)}
                                                >
                                                    Edit
                                                </button>
                                            )}



                                            <button
                                                className="w-24 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                onClick={() => deleteBike(bike._id)} // Pass the bike ID here

                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No bikes found for this user.</p>
                            )}
                        </div>




                    </div>
                );

            case "Add":
                navigate("/hostBikeRegister")
                return null
            default:
                return null;
        }
    };



    return (
        <div className=" min-h-screen h-auto bg-gradient-to-b from-white to-sky-300 flex justify-center items-center w-full" >
            <div className="h-auto w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 bg-gradient-to-b from-white to-sky-200 " style={{ marginTop: '80px', marginBottom: '80px' }}>
                {/* Sidebar */}
                <div className="flex h-auto flex-col md:flex-row w-auto">
                    <div className="h-auto w-full md:w-1/4 border-r border-gray-200 pr-4">
                        <ul className="space-y-4 text-gray-700">
                            <li className={`font-semibold cursor-pointer ${activeTab === "Bike Details" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Bike Details")}>Bike Details</li>
                            <li className={`cursor-pointer ${activeTab === "Add" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Add")}>Add</li>
                        </ul>
                    </div>

                    {/* Main Content */}

                    <div className=" h-auto w-full md:w-3/4 pl-4">{renderContent()}</div>


                </div>
            </div>
        </div>
    )
}

export default HostListView