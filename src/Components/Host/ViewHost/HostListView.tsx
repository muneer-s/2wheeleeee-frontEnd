import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Apps/store";
import { deleteSelectedBike, fetchBikeData } from "../../../Api/host";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const HostListView = () => {

    const [activeTab, setActiveTab] = useState<string>("Bike Details");
    const [bikes, setBikes] = useState<any[]>([]); 
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const navigate = useNavigate()
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
                const deleteResponse = await deleteSelectedBike(id); 

                if (deleteResponse.success) {
                    toast.success("Bike deleted successfully!");
                    setBikes((prevBikes) => prevBikes.filter((bike) => bike._id !== id)); 
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
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bike Details</h2>
                        {/*   sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-96 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bikes.length > 0 ? (
                                bikes.map((bike) => (
                                    <div
                                        key={bike._id} // Use a unique identifier here (like `_id`) instead of `index` for production
                                        className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4"
                                        >
                                        <img
                                            src={bike.images[0] || "https://via.placeholder.com/150"} // Display the first image
                                            alt={bike.modelName}
                                            className="w-full h-40 object-cover rounded-lg"
                                            />
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-gray-800">{bike.modelName}</h3>
                                            <p className="text-sm text-gray-600">{bike.registerNumber}</p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Insurance Exp Date:</strong>{" "}
                                                 {new Date(bike.insuranceExpDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Pollution Exp Date:</strong>{" "}
                                                 {new Date(bike.polutionExpDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <button
                                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                onClick={() => navigate(`/HostBikeViewPage/${bike._id}`)}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                onClick={() => navigate(`/EditBikeDetails/${bike._id}`)}
                                            >
                                                Edit
                                            </button>

                                            {/* {bike.isEdit && (
                                                <button
                                                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                    onClick={() => navigate(`/EditBike/${bike._id}`)}
                                                >
                                                    Edit
                                                </button>
                                            )} */}



                                            <button
                                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                onClick={() => deleteBike(bike._id)} 
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
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-300 flex justify-center items-center">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <button
                className="md:hidden mb-4 bg-sky-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? "Close Menu" : "Open Menu"}
              </button>
              <div
                className={`${
                  isSidebarOpen ? "block" : "hidden"
                } md:block w-full md:w-1/4 border-r border-gray-200 pr-4`}
              >
                <ul className="space-y-4 text-gray-700">
                  <li
                    className={`font-semibold cursor-pointer ${
                      activeTab === "Bike Details" ? "text-sky-500" : ""
                    }`}
                    onClick={() => setActiveTab("Bike Details")}
                  >
                    Bike Details
                  </li>
                  <li
                    className={`cursor-pointer ${
                      activeTab === "Add" ? "text-sky-500" : ""
                    }`}
                    onClick={() => setActiveTab("Add")}
                  >
                    Add
                  </li>
                </ul>
              </div>
    
              {/* Main Content */}
              <div className="w-full md:w-3/4 pl-4">{renderContent()}</div>
            </div>
          </div>
        </div>
      );



    // return (
    //     <div className=" min-h-screen bg-gradient-to-b from-white to-sky-300 flex justify-center items-center" >
    //         <div className=" w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 bg-gradient-to-b from-white to-sky-200 " style={{ marginTop: '80px', marginBottom: '80px' }}>
    //             {/* Sidebar */}
    //             <div className="flex h-auto flex-col md:flex-row w-auto">
    //                 <div className="h-auto w-full md:w-1/4 border-r border-gray-200 pr-4">
    //                     <ul className="space-y-4 text-gray-700">
    //                         <li className={`font-semibold cursor-pointer ${activeTab === "Bike Details" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Bike Details")}>Bike Details</li>
    //                         <li className={`cursor-pointer ${activeTab === "Add" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Add")}>Add</li>
    //                     </ul>
    //                 </div>

    //                 {/* Main Content */}

    //                 <div className=" h-auto w-full md:w-3/4 pl-4">{renderContent()}</div>


    //             </div>
    //         </div>
    //     </div>
    // )
}

export default HostListView