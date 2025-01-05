import { useEffect, useState } from "react";
import { getAllBikeList } from "../../../Api/user";
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
}

const BikeListComp = () => {
    const [bikes, setBikes] = useState<BikeInterface[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBikeData = async () => {
            try {
                const response = await getAllBikeList()
                setBikes(response.bikeList);
            } catch (error) {
                console.error("Error fetching bike data:", error);
            }
        };

        fetchBikeData();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-b from-white to-sky-300 min-h-screen">
            <button className="bg-sky-200 rounded pl-3 pr-3" onClick={()=>navigate(-1)}>Back</button>
            <h1 className="text-3xl font-bold text-center mb-8">Available Bikes</h1>


            <div className=" h-80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-14 bg-gradient-to-b from-white to-sky-200">
                {bikes.map((bike) => (
                    <div
                        key={bike._id}
                        className="mt-3 ml-2 bg-gradient-to-b from-white to-sky-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        style={{ width: "200px", height: "300px" }} // Control card dimensions
                    >
                        {/* Bike Image */}
                        <img
                            src={bike.images[0] || "https://via.placeholder.com/150"}
                            alt={`${bike.companyName} ${bike.modelName}`}
                            className="w-full h-28 object-cover" // Reduced height
                        />
                        {/* Bike Details */}
                        <div className="p-2">
                            <h2 className="text-lg font-semibold mb-1 text-center align-middle">
                                {bike.modelName}
                            </h2>
                            <h3 className="text-sm font-medium text-center">{bike.companyName}</h3>
                            <p className="text-gray-500 text-xs mt-2 text-center">
                                <strong>Fuel:</strong> {bike.fuelType}
                            </p>
                            <p className="text-gray-500 text-xs text-center">
                                <strong>Rent:</strong> ₹{bike.rentAmount}/day
                            </p>
                        </div>
                        <button 
                        className="w-full bg-sky-400 text-center py-2 rounded-md shadow-sm hover:bg-gray-100 transition"
                        onClick={() => navigate(`/UserBikeSinglePage/${bike._id}`)}
                        >
                            View
                        </button>

                    </div>
                ))}
            </div>





        </div>
    );
};

export default BikeListComp;