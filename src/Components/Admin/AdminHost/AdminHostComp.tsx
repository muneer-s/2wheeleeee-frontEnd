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
        // Pass bike and user details as state
        navigate('/singleBikeViewPage', { state: { bike } });
    }

    return (
        <div className="overflow-x-auto p-4">
            <h1 className="text-xl font-bold mb-4">Bike Details</h1>
            <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">User Profile</th>
                        <th className="border border-gray-300 p-2">User Name</th>
                        <th className="border border-gray-300 p-2">Company Name</th>
                        <th className="border border-gray-300 p-2">Model Name</th>
                        <th className="border border-gray-300 p-2">Rent Amount</th>
                        <th className="border border-gray-300 p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {bikeList.map((bike) => (
                        <tr key={bike._id} className="text-center">
                            {/* User Profile Picture */}
                            <td className="border border-gray-300 p-2">
                                <img
                                    src={bike.userDetails.profile_picture}
                                    alt={bike.userDetails.name}
                                    className="w-12 h-12 rounded-full mx-auto"
                                />
                            </td>
                            {/* User Name */}
                            <td className="border border-gray-300 p-2">{bike.userDetails.name}</td>
                            {/* Bike Details */}
                            <td className="border border-gray-300 p-2">{bike.companyName}</td>
                            <td className="border border-gray-300 p-2">{bike.modelName}</td>
                            <td className="border border-gray-300 p-2">₹{bike.rentAmount}</td>
                            <td><button className=" p-2" onClick={() => singlePageView(bike)}> View </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminHostComp;
