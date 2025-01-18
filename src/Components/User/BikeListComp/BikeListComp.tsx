import { useEffect, useState } from "react";
import { getAllBikeList } from "../../../api/user";
import { useNavigate } from "react-router-dom";

interface BikeInterface {
    isHost: boolean;
    _id: string;
    userId: string;
    companyName: string;
    modelName: string;
    rentAmount: number | string;
    fuelType: string;
    images: string[];
    registerNumber: string;
    insuranceExpDate: Date | string;
    polutionExpDate: Date | string;
    rcImage: string | null;
    insuranceImage: string | null;
    polutionImage: string | null;
}

const BikeListComp = () => {
    const [bikes, setBikes] = useState<BikeInterface[]>([]);
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
            setBikes(response.bikeList);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching bike data:", error);
        }
    };

    useEffect(() => {
        fetchBikeData();
    }, [currentPage, search, fuelType, minRent, maxRent]);

    // useEffect(() => {
    //     const fetchBikeData = async () => {
    //         try {
    //             const response = await getAllBikeList();
    //             setBikes(response.bikeList);
    //         } catch (error) {
    //             console.error("Error fetching bike data:", error);
    //         }
    //     };

    //     fetchBikeData();
    // }, []);

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
                <div className="mb-10 p-4 bg-white rounded flex shadow-lg gap-4 w-full mt-10">

                    <input
                        type="text"
                        placeholder="Search by model/company"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-1/3 mb-4 p-2 border rounded mt-7"
                    />
                    
                    <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="w-1/3 mb-4 p-2 border rounded"
                    >
                        <option value="">All Fuel Types</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                    </select>
                    <div className="mb-4 w-1/3 flex">
                        <input
                            type="number"
                            placeholder="Min Rent"
                            value={minRent}
                            onChange={(e) => setMinRent(e.target.value)}
                            className="w-1/3 p-2 border rounded mr-2"
                        />
                        <input
                            type="number"
                            placeholder="Max Rent"
                            value={maxRent}
                            onChange={(e) => setMaxRent(e.target.value)}
                            className="w-1/3 p-2 border rounded"
                        />
                    </div>
                    {/* <button
                        className=" hidden w-full bg-sky-500 text-white py-2 rounded"
                        onClick={() => fetchBikeData()} 
                    >
                        Apply Filters
                    </button> */}
                </div>



                {/* Bike List Section */}
                <div className="w-3/4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pl-6">
                    {bikes.map((bike) => {
                        const isInsuranceExpired =
                            new Date(bike.insuranceExpDate) <= new Date();
                        const isPolutionExpired =
                            new Date(bike.polutionExpDate) <= new Date();
                        const isExpired = isInsuranceExpired || isPolutionExpired;

                        return (
                            <div
                                key={bike._id}
                                className="bg-white p-4 rounded shadow"
                            >
                                <img
                                    src={bike.images[0] || "https://via.placeholder.com/150"}
                                    alt={`${bike.companyName} ${bike.modelName}`}
                                    className="w-full h-32 object-cover rounded"
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
            <div className="flex justify-center mt-6">
                <button
                    className="p-2 mx-2 bg-gray-300 rounded"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    
                >
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    className="p-2 mx-2 bg-gray-300 rounded"
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
