import { useEffect, useState } from "react";
import { getAllBikeList } from "../../../Api/user";
import { useNavigate } from "react-router-dom";
import { IBikeDetails } from "../../../Interfaces/User/IUser";
import { handleApiResponse } from "../../../Utils/apiUtils";
import toast from "react-hot-toast";


const BikeListComp = () => {
    const [bikes, setBikes] = useState<IBikeDetails[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [minRent, setMinRent] = useState("");
    const [maxRent, setMaxRent] = useState("");

    const navigate = useNavigate();

    const fetchBikeData = async () => {
        try {
            const response = await getAllBikeList({
                page: currentPage,
                search,
                fuelType,
                minRent,
                maxRent,
            });

            const data = handleApiResponse(response)

            setBikes(data.bikeList);
            setTotalPages(data.totalPages);
        } catch (err:any) {
            console.error("Error fetching bike data:", err);
            toast.error(err.message || 'INTERNAL SERVER ERROR')
        }
    };

    useEffect(() => {
        fetchBikeData();
    }, [currentPage, search, fuelType, minRent, maxRent]);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-b from-white to-sky-300 min-h-screen ">
            <button
                className="bg-sky-200 rounded pl-3 pr-3"
                onClick={() => navigate(-1)}
            >
                Back
            </button>

            <h1 className="text-3xl font-bold text-center mb-8 mt-28">Available Bikes</h1>

            <div className="w-full">
                {/* Filters Section */}
                <div className="mb-10 p-4 bg-white rounded shadow-lg gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                    <input
                        type="text"
                        placeholder="Search by model/company"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full mb-4 p-2 border rounded"
                    />

                    <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="w-full mb-4 p-2 border rounded"
                    >
                        <option value="">All Fuel Types</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                    </select>
                    <div className="flex w-full gap-2">
                        <input
                            type="number"
                            placeholder="Min Rent ( > 0)"
                            value={minRent}
                            onChange={(e) => setMinRent(e.target.value)}
                            className="w-1/2 p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Max Rent"
                            value={maxRent}
                            onChange={(e) => setMaxRent(e.target.value)}
                            className="w-1/2 p-2 border rounded"
                        />
                    </div>
                    {/* <button
                        className="  w-full bg-sky-500 text-white py-2 rounded"
                        onClick={() => fetchBikeData()} 
                    >
                        Apply Filters
                    </button> */}
                </div>



                {/* Bike List Section */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {bikes.map((bike) => {
                        const isInsuranceExpired =
                            new Date(bike.insuranceExpDate) <= new Date();
                        const isPolutionExpired =
                            new Date(bike.polutionExpDate) <= new Date();
                        const isExpired = isInsuranceExpired || isPolutionExpired;

                        return (
                            <div
                                key={bike._id}
                                className="bg-white p-4 rounded shadow transition-transform hover:scale-105"
                            >
                                <img
                                    src={bike.images[0] || "https://via.placeholder.com/150"}
                                    alt={`${bike.companyName} ${bike.modelName}`}
                                    className="w-full h-40 object-cover rounded"
                                />
                                <h2 className="text-lg font-semibold mt-2">{bike.modelName}</h2>
                                <p>{bike.companyName}</p>
                                <p>Fuel: {bike.fuelType}</p>
                                <p>Rent: ₹{bike.rentAmount}/day</p>
                                {isExpired && (
                                    <p className="text-red-500">Expired Documents</p>
                                )}
                                <button
                                    className="w-full bg-sky-500 text-white py-1 mt-2 rounded"
                                    onClick={() => navigate(`/UserBikeSinglePage/${bike._id}`)}
                                >
                                    View
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
                <button
                    className="p-3 px-6 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}

                >
                    Previous
                </button>
                <span className="px-3">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    className="p-3 px-6 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BikeListComp;
