import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { singleBikeView, updateBikeDetails } from "../../../Api/host"; // Backend API functions
import toast from "react-hot-toast";
import { BikeData } from "../../../Interfaces/BikeInterface";

const EditBike = () => {
    const { id } = useParams();
    console.log(222, id);

    const navigate = useNavigate();

    const [bikeData, setBikeData] = useState<BikeData | null>(null);
    const [newImages, setNewImages] = useState<File[]>([]); // For new image uploads

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await singleBikeView(id as string);
                console.log(132, response);

                if (response.success) {
                    setBikeData(response.bike);
                    console.log(1212, response.bike);
                } else {
                    toast.error("Failed to fetch bike details.");
                }
            } catch (error) {
                console.error("Error fetching bike details:", error);
                toast.error("Error fetching bike details.");
            }
        };

        if (id) {
            fetchBikeDetails();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (bikeData) {
            setBikeData({
                ...bikeData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (bikeData && files.length + bikeData.images.length > 4) {
                toast.error("You can upload a maximum of 4 images.");
                return;
            }
            setNewImages(files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bikeData) {
            toast.error("No bike data available.");
            return;
        }

        const formData = new FormData();
        formData.append("modelName", bikeData.modelName);
        formData.append("registerNumber", bikeData.registerNumber);



        formData.append(
            "insuranceExpDate",
            bikeData.insuranceExpDate
                ? typeof bikeData.insuranceExpDate === "string"
                    ? bikeData.insuranceExpDate
                    : bikeData.insuranceExpDate.toISOString()
                : ""
        );
        formData.append(
            "polutionExpDate",
            bikeData.polutionExpDate
                ? typeof bikeData.polutionExpDate === "string"
                    ? bikeData.polutionExpDate
                    : bikeData.polutionExpDate.toISOString()
                : ""
        );






        newImages.forEach((file) => formData.append("images", file));

        try {
            const response = await updateBikeDetails(id, formData);
            if (response.success) {
                toast.success("Bike details updated successfully!");
                navigate("/HostListView"); // Redirect after successful update
            } else {
                toast.error("Failed to update bike details.");
            }
        } catch (error) {
            console.error("Error updating bike details:", error);
            toast.error("Error updating bike details.");
        }
    };

    if (!bikeData) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <p>Loading bike details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-6">Edit Bike Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Model Name</label>
                        <input
                            type="text"
                            name="modelName"
                            value={bikeData.modelName || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Register Number</label>
                        <input
                            type="text"
                            name="registerNumber"
                            value={bikeData.registerNumber || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Insurance Expiry Date</label>
                        <input
                            type="date"
                            name="insuranceExpDate"
                            value={
                                bikeData.insuranceExpDate
                                    ? typeof bikeData.insuranceExpDate === "string"
                                        ? bikeData.insuranceExpDate.split("T")[0]
                                        : bikeData.insuranceExpDate.toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />

                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Pollution Expiry Date</label>
                        <input
                            type="date"
                            name="polutionExpDate"
                            value={
                                bikeData.polutionExpDate
                                    ? typeof bikeData.polutionExpDate === "string"
                                        ? bikeData.polutionExpDate.split("T")[0]
                                        : bikeData.polutionExpDate.toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                        

                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Current Images</label>
                        <div className="mb-4">
                            {/* <label className="block text-sm font-medium text-gray-700">Current Images</label> */}
                            <div className="flex space-x-2 mt-2">
                                {bikeData.images.map((img, index) => {
                                    const imageUrl = typeof img === "string" ? img : URL.createObjectURL(img);
                                    return (
                                        <img
                                            key={index}
                                            src={imageUrl} // Use the correct URL
                                            alt={`Bike ${index + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Upload New Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBike;
