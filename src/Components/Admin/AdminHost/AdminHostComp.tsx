import { useEffect, useState } from "react";
import { getAllBikeDetails } from "../../../Api/admin";
import { useNavigate } from "react-router-dom";

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    profile_picture: string;
    address: string;
    phoneNumber: number;
}

interface BikeInterface {
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
    const navigate = useNavigate()


    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await getAllBikeDetails();

                if (response && response.data) {
                    console.log("Bike List in Admin Side:", response.data);
                    setBikeList(response.data.bikeList);
                } else {
                    console.error("Unexpected response structure:", response);
                }
            } catch (error) {
                console.error("Error fetching bike details:", error);
            }
        };

        fetchBikeDetails();
    }, []);

    const singlePageView = (bike: BikeInterface) => {
        // pass bike and user details as state
        navigate('/singleBikeViewPage', { state: { bike } });
    }

    return (
        <div className="overflow-x-auto p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Bike Details</h1>
            <table className="table-auto w-full border-collapse rounded-lg shadow-lg bg-white">
                <thead className="bg-gray-100 text-gray-600">
                    <tr>
                        <th className="border border-gray-300 p-3 text-left">User Profile</th>
                        <th className="border border-gray-300 p-3 text-left">User Name</th>
                        <th className="border border-gray-300 p-3 text-left">Company Name</th>
                        <th className="border border-gray-300 p-3 text-left">Model Name</th>
                        <th className="border border-gray-300 p-3 text-left">Rent Amount</th>
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
        </div>
    );
};

export default AdminHostComp;
