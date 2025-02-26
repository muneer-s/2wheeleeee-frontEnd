import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editBike, singleBikeView } from "../../../Api/host";
import { BikeData } from "../../../Interfaces/BikeInterface";
import toast from "react-hot-toast";
import { handleApiResponse } from "../../../Utils/apiUtils";

const EditBike = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bikeData, setBikeData] = useState<BikeData | null>(null);
    const [newInsuranceImage, setNewInsuranceImage] = useState<File | null>(null);
    const [newPolutionImage, setNewPolutionImage] = useState<File | null>(null);
    const [insurancePreview, setInsurancePreview] = useState<string | null>(null);
    const [polutionPreview, setPolutionPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await singleBikeView(id as string);
                const data = handleApiResponse(response)
                if (response.success) {
                    setBikeData(data.bike);
                    setInsurancePreview(data.bike.insuranceImage);
                    setPolutionPreview(data.bike.PolutionImage);
                } else {
                    console.error("Failed to fetch bike details.");
                }
            } catch (error) {
                console.error("Error fetching bike details:", error);
            }
        };

        if (id) {
            fetchBikeDetails();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (bikeData) {
            setBikeData({
                ...bikeData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);

            if (type === "insuranceImage") {
                setNewInsuranceImage(file);
                setInsurancePreview(previewUrl);
            } else if (type === "polutionImage") {
                setNewPolutionImage(file);
                setPolutionPreview(previewUrl);
            }
        }
    };

    const cancelImage = (type: string) => {
        if (type === "insuranceImage") {
            setNewInsuranceImage(null);
            setInsurancePreview(null);
        } else if (type === "polutionImage") {
            setNewPolutionImage(null);
            setPolutionPreview(null);
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(today.getMonth() + 6);

        if (!bikeData?.insuranceExpDate || new Date(bikeData.insuranceExpDate) < sixMonthsLater) {
            newErrors.insuranceExpDate = "Insurance expiry date must be at least 6 months from today.";
        }

        if (!bikeData?.polutionExpDate || new Date(bikeData.polutionExpDate) < sixMonthsLater) {
            newErrors.polutionExpDate = "Pollution expiry date must be at least 6 months from today.";
        }

        if (!newInsuranceImage && !insurancePreview) {
            newErrors.insuranceImage = "Insurance image is required.";
        }

        if (!newPolutionImage && !polutionPreview) {
            newErrors.polutionImage = "Pollution image is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bikeData || !validateForm()) {
            return;
        }
        setLoading(true);

        const formData = new FormData();

        formData.append("insuranceExpDate", new Date(bikeData.insuranceExpDate).toISOString());
        formData.append("polutionExpDate", new Date(bikeData.polutionExpDate).toISOString());

        if (newInsuranceImage) formData.append("insuranceImage", newInsuranceImage);
        if (newPolutionImage) formData.append("polutionImage", newPolutionImage);

        try {
            const response = await editBike(id, formData);

            if (response.success) {
                toast.success("Bike details updated successfully!");
                navigate(-1);
            } else {
                console.error("Failed to update bike details.");
                toast.error("Failed to update bike details.");
            }
        } catch (error) {
            console.error("Error updating bike details:", error);
        } finally {
            setLoading(false);
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
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Model Name</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{bikeData.modelName}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Register Number</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{bikeData.registerNumber}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Insurance Expiry Date</label>
                        <input
                            type="date"
                            name="insuranceExpDate"
                            value={bikeData.insuranceExpDate ? new Date(bikeData.insuranceExpDate).toISOString().split('T')[0] : ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.insuranceExpDate && <p className="text-red-500 text-sm">{errors.insuranceExpDate}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Pollution Expiry Date</label>
                        <input
                            type="date"
                            name="polutionExpDate"
                            value={bikeData.polutionExpDate ? new Date(bikeData.polutionExpDate).toISOString().split('T')[0] : ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.polutionExpDate && <p className="text-red-500 text-sm">{errors.polutionExpDate}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Insurance Image</label>
                        {insurancePreview && (
                            <div className="relative">
                                <img src={insurancePreview} alt="Insurance Preview" className="h-40 w-40 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => cancelImage("insuranceImage")}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "insuranceImage")}
                            className="mt-1 block w-full text-gray-500"
                        />
                        {errors.insuranceImage && <p className="text-red-500 text-sm">{errors.insuranceImage}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Polution Image</label>
                        {polutionPreview && (
                            <div className="relative">
                                <img src={polutionPreview} alt="Pollution Preview" className="h-40 w-40 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => cancelImage("polutionImage")}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "polutionImage")}
                            className="mt-1 block w-full text-gray-500"
                        />
                        {errors.polutionImage && <p className="text-red-500 text-sm">{errors.polutionImage}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        disabled={loading}
                        className={`bg-red-500 text-white px-4 py-2 ml-5 rounded-lg hover:bg-red-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBike;