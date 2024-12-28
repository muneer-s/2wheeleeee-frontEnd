import { useEffect, useState } from "react";
import { getAllBikeDetails, logout } from "../../../Api/admin";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    profile_picture: string;
    address: string;
    phoneNumber: number;
}

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
    pollutionExpDate: Date | string;
    rcImage: string | null;
    insuranceImage: string | null;
    userDetails: UserDetails;
}

const AdminHostComp = () => {
    const [bikeList, setBikeList] = useState<BikeInterface[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBikes, setTotalBikes] = useState(0);
    const limit = 10;

    const navigate = useNavigate()


   const fetchBikeDetails = async () => {
        try {
            const response = await getAllBikeDetails({ page: currentPage, limit, search, filter, sort });
            if (response.success) {
                setBikeList(response.bikeDetails.bikes);
                setTotalBikes(response.bikeDetails.total);
            } else {
                toast.error('Failed to fetch bike details');
            }
        } catch (error) {
            toast.error('Error fetching bike details');
        }
    };

    useEffect(() => {
        fetchBikeDetails();
    }, [currentPage, search, filter, sort]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value);
        setCurrentPage(1);
    };


    const singlePageView = (bike: BikeInterface) => {
        navigate('/singleBikeViewPage', { state: { bike } });
    }

    return (
        <div className="bg-gradient-to-b from-white to-sky-200 " style={{ minHeight: '100vh' }}>
            <div className="overflow-x-auto p-6 ">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Bike Details</h1>

                <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search by user name"
                    value={search}
                    onChange={handleSearch}
                    className="border px-4 py-2 rounded-lg"
                />
                <select value={filter} onChange={handleFilter} className="border px-4 py-2 rounded-lg">
                    <option value="">All</option>
                    <option value="verified">Verified</option>
                    <option value="notVerified">Not Verified</option>
                </select>
                <select value={sort} onChange={handleSort} className="border px-4 py-2 rounded-lg">
                    <option value="">Sort by Rent</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>




                <table className="table-auto w-full border-collapse rounded-lg shadow-lg bg-gradient-to-b from-white to-sky-200 " >
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="border border-gray-300 p-3 text-left">User Profile</th>
                            <th className="border border-gray-300 p-3 text-left">User Name</th>
                            <th className="border border-gray-300 p-3 text-left">Company Name</th>
                            <th className="border border-gray-300 p-3 text-left">Model Name</th>
                            <th className="border border-gray-300 p-3 text-left">Rent Amount</th>
                            <th className="border border-gray-300 p-3 text-left">Verify or Not</th>
                            <th className="border border-gray-300 p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bikeList.length > 0 ? (
                            bikeList.map((bike) => (
                                <tr key={bike._id} className="border-b hover:bg-gray-50 transition duration-300 ease-in-out">
                                    {/* User Profile Picture */}
                                    <td className=" p-4 flex justify-center items-center">
                                        <img
                                            src={bike.userDetails.profile_picture || 'https://via.placeholder.com/150'}
                                            alt={bike.userDetails.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 hover:scale-105 transition transform"
                                        />
                                    </td>
                                    {/* User Name */}
                                    <td className="border border-gray-300 p-4">{bike.userDetails.name}</td>
                                    {/* Bike Details */}
                                    <td className="border border-gray-300 p-4">{bike.companyName}</td>
                                    <td className="border border-gray-300 p-4">{bike.modelName}</td>
                                    <td className="border border-gray-300 p-4 text-green-500 font-semibold">₹{bike.rentAmount}</td>


                                    <td className={`border border-gray-300 p-4 font-semibold ${bike.isHost ? 'text-green-500' : 'text-red-500'}`}>
                                        {bike.isHost ? 'Verified' : 'Not Verified'}
                                    </td>



                                    <td className=" p-4 flex justify-center items-center">
                                        <button
                                            onClick={() => singlePageView(bike)}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">No bikes found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-center">
                {[...Array(Math.ceil(totalBikes / limit))].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>




            </div>
        </div>

    );
};

export default AdminHostComp;
