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
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const fetchBikeData = async () => {
        setIsLoading(true);
        try {
            const response = await getAllBikeList({
                page: currentPage,
                search,
                fuelType,
                minRent,
                maxRent,
            });

            const data = handleApiResponse(response);

            setBikes(data.bikeList);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            console.error("Error fetching bike data:", err);
            toast.error(err.message || 'INTERNAL SERVER ERROR');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBikeData();
    }, [currentPage, search, fuelType, minRent, maxRent]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <div className="bg-blue-600 dark:bg-blue-800 text-white py-12 px-6 shadow-lg">
                <div className="container mx-auto max-w-6xl">
                    <button
                        className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors duration-200 mt-6"
                        onClick={() => navigate(-1)}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-4xl font-bold mt-4 mb-2">Explore Available Bikes</h1>
                    <p className="text-lg text-blue-100 dark:text-blue-200 max-w-2xl">
                        Find your perfect ride with our extensive collection of high-quality bikes
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-6 py-10">
                {/* Filters Section */}
                <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 -mt-16 relative z-10">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Filter Options</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Location, model or company"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                                />
                                <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Fuel Type</label>
                            <select
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                            >
                                <option value="">All Fuel Types</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Min Rent (₹)</label>
                            <input
                                type="number"
                                placeholder="Minimum amount"
                                value={minRent}
                                onChange={(e) => setMinRent(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Max Rent (₹)</label>
                            <input
                                type="number"
                                placeholder="Maximum amount"
                                value={maxRent}
                                onChange={(e) => setMaxRent(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {bikes.length > 0 ? `Available Bikes (${bikes.length})` : "No bikes found"}
                    </h2>
                    
                    {/* Sort Option - Can be implemented if needed */}
                    {/* <select className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <option>Sort by: Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select> */}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && bikes.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <p className="mt-4 text-xl font-medium text-gray-600 dark:text-gray-400">No bikes match your filters</p>
                        <p className="mt-2 text-gray-500 dark:text-gray-500">Try adjusting your search parameters</p>
                    </div>
                )}

                {/* Bike List Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!isLoading && bikes.map((bike) => {
                        const isInsuranceExpired = new Date(bike.insuranceExpDate) <= new Date();
                        const isPolutionExpired = new Date(bike.polutionExpDate) <= new Date();
                        const isExpired = isInsuranceExpired || isPolutionExpired;

                        return (
                            <div
                                key={bike._id}
                                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={bike.images[0] || "https://via.placeholder.com/400x300"}
                                        alt={`${bike.companyName} ${bike.modelName}`}
                                        className="w-full h-56 object-cover"
                                    />
                                    {bike.offerApplied && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white py-1 px-3 rounded-full text-sm font-medium">
                                            Special Offer
                                        </div>
                                    )}
                                    {isExpired && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white py-1 px-3 rounded-full text-sm font-medium">
                                            Document Expired
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{bike.modelName}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{bike.companyName}</p>
                                        </div>
                                        {bike.offerApplied ? (
                                            <div className="text-right">
                                                <p className="text-green-600 font-bold text-xl">₹{bike.offerPrice}</p>
                                                <p className="text-sm text-gray-500 line-through">₹{bike.rentAmount}</p>
                                                <p className="text-xs text-gray-500">per day</p>
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <p className="text-gray-900 dark:text-white font-bold text-xl">₹{bike.rentAmount}</p>
                                                <p className="text-xs text-gray-500">per day</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {bike.location}
                                        </div>
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {bike.fuelType} Engine
                                        </div>
                                    </div>

                                    <button
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        onClick={() => navigate(`/BikeSinglePage/${bike._id}`)}
                                    >
                                        View Details
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {!isLoading && bikes.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center mt-12 gap-2">
                        <button
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>
                        
                        <div className="flex items-center px-4">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                        
                        <button
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BikeListComp;