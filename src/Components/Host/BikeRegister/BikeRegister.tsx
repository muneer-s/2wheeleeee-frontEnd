import React, { useState } from "react";
import toast from "react-hot-toast";
import { saveBikeDetails } from "../../../Api/host";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY


const BikeRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: "",
        modelName: "",
        rentAmount: "",
        fuelType: "",
        location: "",
        images: [] as File[],
        registerNumber: "",
        insuranceExpDate: "",
        polutionExpDate: "",
        rcImage: null as File | null,
        PolutionImage: null as File | null,
        insuranceImage: null as File | null,
    });
    const [rcImagePreview, setRcImagePreview] = useState<string | null>(null);
    const [PolutionImagePreview, setPolutionImagePreview] = useState<string | null>(null);
    const [insuranceImagePreview, setInsuranceImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);


    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });


        if (name === "location") {
            fetchLocationSuggestions(value);
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };


    // Fetch location suggestions from Geoapify
    const fetchLocationSuggestions = async (query: string) => {
        if (!query) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${GEOAPIFY_API_KEY}`
            );

            if (response.data && response.data.features) {
                setLocationSuggestions(
                    response.data.features.map((feature: any) => feature.properties.formatted)
                );
            }
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
        }
    };


    // Handle selecting a location from suggestions
    const handleSelectLocation = (location: string) => {
        setFormData({ ...formData, location });
        setLocationSuggestions([]);
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;

        if (name === "images" && files) {
            const fileArray = Array.from(files);
            if (fileArray.length + formData.images.length > 4) {
                toast.error("You can only upload up to 4 images.");
                return;
            }
            setFormData({ ...formData, images: [...formData.images, ...fileArray] });
        } else if (name === "rcImage" && files?.[0]) {
            setFormData({ ...formData, rcImage: files[0] });
            setRcImagePreview(URL.createObjectURL(files[0]));
        } else if (name === "PolutionImage" && files?.[0]) {
            setFormData({ ...formData, PolutionImage: files[0] });
            setPolutionImagePreview(URL.createObjectURL(files[0]));
        }
        else if (name === "insuranceImage" && files?.[0]) {
            setFormData({ ...formData, insuranceImage: files[0] });
            setInsuranceImagePreview(URL.createObjectURL(files[0]));
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));

    };

    const handleRemoveImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleRemoveSingleImage = (key: "rcImage" | "insuranceImage" | "PolutionImage", setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
        setFormData({ ...formData, [key]: null });
        setPreview(null);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const sixMonthsFromToday = new Date(todayDate);
        sixMonthsFromToday.setMonth(sixMonthsFromToday.getMonth() + 6);

        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";

        if (!formData.modelName.trim()) newErrors.modelName = "Model name is required";

        if (!formData.rentAmount.trim() || isNaN(Number(formData.rentAmount)) || Number(formData.rentAmount) <= 0) {
            newErrors.rentAmount = "Rent amount must be a valid number greater than 0."
        }

        if (!formData.fuelType || formData.fuelType === "Select Fuel Type") {
            newErrors.fuelType = "Please select a fuel type (Petrol or Electric)."

        }
        if (formData.images.length === 0) {
            newErrors.images = "Please upload at least one image."
        }
        if (formData.images.length > 4) {
            newErrors.images = "You can upload a maximum of 4 images."

        }

        if (!formData.registerNumber.trim()) {
            newErrors.registerNumber = "Register number is required."
        }



        if (!formData.insuranceExpDate.trim()) {
            newErrors.insuranceExpDate = "Insurance expiry date is required.";
        } else {
            const insuranceExpDate = new Date(formData.insuranceExpDate);
            if (insuranceExpDate < sixMonthsFromToday) {
                newErrors.insuranceExpDate = "Insurance expiry date must be at least 6 months from today.";
            }
        }

        if (!formData.polutionExpDate.trim()) {
            newErrors.polutionExpDate = "Pollution expiry date is required.";
        } else {
            const polutionExpDate = new Date(formData.polutionExpDate);
            if (polutionExpDate < sixMonthsFromToday) {
                newErrors.polutionExpDate = "Pollution expiry date must be at least 6 months from today.";
            }
        }

        if (!formData.rcImage) {
            newErrors.rcImage = "Please upload the Rc Image.."
        }
        if (!formData.PolutionImage) {
            newErrors.PolutionImage = "Please upload the Polution Image.."
        }

        if (!formData.insuranceImage) {
            newErrors.insuranceImage = "Please upload the Insurance Image.."
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.location) {
            toast.error("Please select a valid location.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        const submissionData = new FormData();

        submissionData.append("companyName", formData.companyName);
        submissionData.append("modelName", formData.modelName);
        submissionData.append("rentAmount", formData.rentAmount);
        submissionData.append("location", formData.location);
        submissionData.append("fuelType", formData.fuelType);
        submissionData.append("registerNumber", formData.registerNumber);
        submissionData.append("insuranceExpDate", formData.insuranceExpDate);
        submissionData.append("polutionExpDate", formData.polutionExpDate);

        formData.images.forEach((image) => {
            submissionData.append(`images`, image);
        });

        if (formData.rcImage) submissionData.append("rcImage", formData.rcImage);
        if (formData.PolutionImage) submissionData.append("PolutionImage", formData.PolutionImage);
        if (formData.insuranceImage) submissionData.append("insuranceImage", formData.insuranceImage);


        setIsSubmitting(true);

        try {
            
            const response = await saveBikeDetails(submissionData);

            if (response?.success) {
                toast.success(response.message);
                navigate('/hostSuccessPage')
            }
        } catch (error) {
            toast.error("An error occurred while submitting the data.");
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }

    }
    const renderError = (field: string) => {
        return errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-300 flex justify-center items-center">
            <div className="h-auto w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 bg-gradient-to-b from-white to-sky-200 " style={{ marginTop: '80px', marginBottom: '80px' }}>
                {/* Details Section */}
                <h2 className="text-2xl font-bold text-center mb-6">Basic Details</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Company */}
                    <div>
                        <label className="block text-gray-700">Company</label>
                        <input
                            type="text"
                            name="companyName"
                            onChange={handleInputChange}
                            placeholder="Enter Company Name"
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {renderError("companyName")}

                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-gray-700">Model</label>
                        <input
                            type="text"
                            name="modelName"
                            onChange={handleInputChange}
                            placeholder="Enter Model Name"
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {renderError("modelName")}

                    </div>

                    {/* Rent Amount */}
                    <div>
                        <label className="block text-gray-700">Rent Amount Per Day</label>
                        <input
                            type="text"
                            name="rentAmount"
                            placeholder="Amount Per Day"
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {renderError("rentAmount")}

                    </div>

                    {/* Fuel Type */}
                    <div>
                        <label className="block text-gray-700">Fuel Type</label>
                        <select
                            name="fuelType"
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        >
                            <option value="">Select fuel Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Electric">Electric</option>
                        </select>
                        {renderError("fuelType")}

                    </div>

                    {/* Location Input */}

                    <div className="relative">
                        <label className="block text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Search location"
                            className="w-full mt-1 p-2 border rounded"
                        />

                        {/* Show location suggestions */}
                        {locationSuggestions.length > 0 && (
                            <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto shadow-lg rounded">
                                {locationSuggestions.map((loc, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelectLocation(loc)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {loc}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Bike Images */}
                    <div className="col-span-2 mb-8">
                        <label className="block text-gray-700">Images (Max 4)</label>
                        <input
                            type="file"
                            name="images"
                            multiple
                            onChange={handleFileChange}
                            className="w-full mt-1"
                            accept="image/*"
                        />
                        {renderError("images")}


                        {/* Image Preview */}
                        <div className="mt-4 flex flex-wrap gap-4">
                            {formData.images.map((file, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    {/* Preview Image */}
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded"
                                    />
                                    {/* Remove Image Button */}
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        title="Remove"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Documents Section */}
                <h2 className="text-2xl font-bold text-center mb-6">Documents</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Register Number */}
                    <div>
                        <label className="block text-gray-700">Enter Reg. No</label>
                        <input
                            type="text"
                            name="registerNumber"
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {renderError("registerNumber")}

                    </div>

                    {/* Insurance Exp Date */}
                    <div>
                        <label className="block text-gray-700">Insurance Exp Date</label>
                        <input
                            type="date"
                            name="insuranceExpDate"
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {renderError("insuranceExpDate")}

                    </div>

                    {/* Pollution Exp Date */}
                    <div>
                        <label className="block text-gray-700">Pollution Exp Date</label>
                        <input
                            type="date"
                            name="polutionExpDate"
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {renderError("polutionExpDate")}

                    </div>

                    {/* Upload RC Image */}
                    <div>
                        <label className="block text-gray-700">Upload RC Image</label>
                        <input
                            type="file"
                            name="rcImage"
                            onChange={handleFileChange}
                            className="w-full mt-1"
                        />
                        {renderError("rcImage")}

                        {rcImagePreview && (
                            <div className="mt-4 relative w-24 h-24">
                                <img src={rcImagePreview} alt="rc Preview" className="w-full h-full object-cover rounded" />
                                <button
                                    onClick={() => handleRemoveSingleImage("rcImage", setRcImagePreview)}

                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    title="Remove"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Upload Polution Image */}
                    <div>
                        <label className="block text-gray-700">Upload Polution Image</label>
                        <input
                            type="file"
                            name="PolutionImage"
                            onChange={handleFileChange}
                            className="w-full mt-1"
                        />
                        {renderError("PolutionImage")}

                        {PolutionImagePreview && (
                            <div className="mt-4 relative w-24 h-24">
                                <img src={PolutionImagePreview} alt="Polution Preview" className="w-full h-full object-cover rounded" />
                                <button
                                    onClick={() => handleRemoveSingleImage("PolutionImage", setPolutionImagePreview)}

                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    title="Remove"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Upload Insurance */}
                    <div>
                        <label className="block text-gray-700">Upload Insurance Image</label>
                        <input
                            type="file"
                            name="insuranceImage"
                            onChange={handleFileChange}
                            className="w-full mt-1"
                        />
                        {renderError("insuranceImage")}

                        {insuranceImagePreview && (
                            <div className="mt-4 relative w-24 h-24">
                                <img src={insuranceImagePreview} alt="Insurance Preview" className="w-full h-full object-cover rounded" />
                                <button
                                    onClick={() => handleRemoveSingleImage("insuranceImage", setInsuranceImagePreview)}

                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    title="Remove"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Proceed Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isSubmitting}

                    >
                        {isSubmitting ? "Submiting..." : "Submit"}

                    </button>
                    <button
                        className={`bg-red-500  hover:bg-red-700 text-white font-serif font-bold py-2 px-4 mx-3 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BikeRegister;
