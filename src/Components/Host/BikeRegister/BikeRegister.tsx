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
            newErrors.rcImage = "Please upload the RC Image."
        }

        if (!formData.PolutionImage) {
            newErrors.PolutionImage = "Please upload the Pollution Image."
        }

        if (!formData.insuranceImage) {
            newErrors.insuranceImage = "Please upload the Insurance Image."
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-12 px-4 mt-10">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 py-4 px-6">
                    <h1 className="text-2xl font-bold text-white text-center">Register Your Bike</h1>
                </div>

                <div className="p-6 md:p-8">
                    {/* Progress steps */}
                    <div className="flex justify-between items-center mb-10 px-4">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <span className="text-sm mt-2 text-blue-600 font-medium">Basic Info</span>
                        </div>
                        <div className="h-1 flex-1 bg-blue-200 mx-2"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <span className="text-sm mt-2 text-blue-600 font-medium">Documents</span>
                        </div>
                        <div className="h-1 flex-1 bg-blue-200 mx-2"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
                            <span className="text-sm mt-2 text-gray-500">Complete</span>
                        </div>
                    </div>

                    {/* Basic Details Section */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
                            <span className="w-8 h-8 bg-blue-600 text-white rounded-full mr-3 flex items-center justify-center text-sm font-bold">1</span>
                            Basic Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    onChange={handleInputChange}
                                    placeholder="Enter Company Name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                                {renderError("companyName")}
                            </div>

                            {/* Model */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Model Name</label>
                                <input
                                    type="text"
                                    name="modelName"
                                    onChange={handleInputChange}
                                    placeholder="Enter Model Name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                                {renderError("modelName")}
                            </div>

                            {/* Rent Amount */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Rent Amount Per Day (₹)</label>
                                <input
                                    type="text"
                                    name="rentAmount"
                                    placeholder="Enter amount per day"
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                                {renderError("rentAmount")}
                            </div>

                            {/* Fuel Type */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Fuel Type</label>
                                <select
                                    name="fuelType"
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all appearance-none bg-white"
                                >
                                    <option value="">Select Fuel Type</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Electric">Electric</option>
                                </select>
                                {renderError("fuelType")}
                            </div>

                            {/* Location Input */}
                            <div className="form-group relative col-span-full">
                                <label className="block text-gray-700 font-medium mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Search location"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />

                                {/* Show location suggestions */}
                                {locationSuggestions.length > 0 && (
                                    <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-y-auto shadow-lg rounded-lg">
                                        {locationSuggestions.map((loc, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleSelectLocation(loc)}
                                                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                                            >
                                                {loc}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Bike Images */}
                        <div className="mt-8">
                            <label className="block text-gray-700 font-medium mb-2">
                                Bike Images <span className="text-sm text-gray-500">(Max 4)</span>
                            </label>

                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-3 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-blue-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 4)</p>
                                    </div>
                                    <input
                                        type="file"
                                        name="images"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            {renderError("images")}

                            {/* Image Preview */}
                            {formData.images.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-gray-700 font-medium mb-3">Uploaded Images:</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {formData.images.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md transition-all"
                                                    title="Remove"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
                            <span className="w-8 h-8 bg-blue-600 text-white rounded-full mr-3 flex items-center justify-center text-sm font-bold">2</span>
                            Documents & Registration
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Register Number */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Registration Number</label>
                                <input
                                    type="text"
                                    name="registerNumber"
                                    onChange={handleInputChange}
                                    placeholder="Enter registration number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                                {renderError("registerNumber")}
                            </div>

                            {/* Insurance Exp Date */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Insurance Expiry Date</label>
                                <input
                                    type="date"
                                    name="insuranceExpDate"
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                                {renderError("insuranceExpDate")}
                            </div>

                            {/* Pollution Exp Date */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Pollution Expiry Date</label>
                                <input
                                    type="date"
                                    name="polutionExpDate"
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                                {renderError("polutionExpDate")}
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            {/* Upload RC Image */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">RC Certificate</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition-all">
                                    <input
                                        type="file"
                                        name="rcImage"
                                        id="rcImage"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="rcImage" className="cursor-pointer block">
                                        {rcImagePreview ? (
                                            <div className="relative mx-auto w-24 h-24">
                                                <img src={rcImagePreview} alt="RC Preview" className="w-full h-full object-cover rounded" />
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveSingleImage("rcImage", setRcImagePreview);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                                                    title="Remove"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">Upload RC Image</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {renderError("rcImage")}
                            </div>

                            {/* Upload Pollution Image */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Pollution Certificate</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition-all">
                                    <input
                                        type="file"
                                        name="PolutionImage"
                                        id="PolutionImage"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="PolutionImage" className="cursor-pointer block">
                                        {PolutionImagePreview ? (
                                            <div className="relative mx-auto w-24 h-24">
                                                <img src={PolutionImagePreview} alt="Pollution Preview" className="w-full h-full object-cover rounded" />
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveSingleImage("PolutionImage", setPolutionImagePreview);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                                                    title="Remove"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">Upload Pollution Image</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {renderError("PolutionImage")}
                            </div>

                            {/* Upload Insurance */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Insurance Certificate</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition-all">
                                    <input
                                        type="file"
                                        name="insuranceImage"
                                        id="insuranceImage"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="insuranceImage" className="cursor-pointer block">
                                        {insuranceImagePreview ? (
                                            <div className="relative mx-auto w-24 h-24">
                                                <img src={insuranceImagePreview} alt="Insurance Preview" className="w-full h-full object-cover rounded" />
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveSingleImage("insuranceImage", setInsuranceImagePreview);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                                                    title="Remove"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">Upload Insurance Image</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {renderError("insuranceImage")}
                            </div>
                        </div>

                        {/* Info box */}
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-8 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">
                                        Please ensure all documents are valid for at least 6 months from today. Clear images of all documents are required.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all mr-4"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Register Bike
                                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BikeRegister;