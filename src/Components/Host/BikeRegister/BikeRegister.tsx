import React, { useState } from "react";
import toast from "react-hot-toast";
import { saveBikeDetails } from "../../../Api/host";
import { BikeData } from "../../../Interfaces/BikeInterface";
import { useAppSelector } from "../../../app/store";
import { useNavigate } from "react-router-dom";




const BikeRegister = () => {

    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user
    console.log("222", userDetails);


    const [formData, setFormData] = useState({
        companyName: "",
        modelName: "",
        rentAmount: "",
        fuelType: "",
        images: [] as File[],
        registerNumber: "",
        insuranceExpDate: "",
        polutionExpDate: "",
        rcImage: null as File | null,
        insuranceImage: null as File | null,
    });

    const [rcImagePreview, setRcImagePreview] = useState<string | null>(null);
    const [insuranceImagePreview, setInsuranceImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // const [errors, setErrors] = useState({}); // State for errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Handle file input change (limit to 4 files and preview)
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
        } else if (name === "insuranceImage" && files?.[0]) {
            setFormData({ ...formData, insuranceImage: files[0] });
            setInsuranceImagePreview(URL.createObjectURL(files[0]));
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));

    };



    // Remove an image
    const handleRemoveImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };


    const handleRemoveSingleImage = (key: "rcImage" | "insuranceImage", setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
        setFormData({ ...formData, [key]: null });
        setPreview(null);
    };


    const validateForm = () => {

        // const newErrors = {};

        const newErrors: { [key: string]: string } = {};

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
        // } else if (!/^[0-9/]+$/.test(formData.registerNumber.trim())) {
        //     newErrors.registerNumber = "Register number must contain only numbers and '/'."
        // }



        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.insuranceExpDate.trim()) {
            newErrors.insuranceExpDate = "Insurance expiry date is required."

        }
        if (formData.insuranceExpDate.trim()) {
            const insuranceExpDate = new Date(formData.insuranceExpDate);
            if (insuranceExpDate <= today) {
                newErrors.insuranceExpDate = "Insurance expiry date cannot be earlier than today."
            }
        }

        if (!formData.polutionExpDate.trim()) {
            newErrors.polutionExpDate = "Polution expiry date is required."

        }
        if (formData.polutionExpDate.trim()) {
            const polutionExpDate = new Date(formData.polutionExpDate);
            if (polutionExpDate <= today) {
                newErrors.polutionExpDate = "Pollution expiry date cannot be earlier than today."
            }
        }

        if (!formData.rcImage) {
            newErrors.rcImage = "Please upload the Rc Image.."
        }

        if (!formData.insuranceImage) {
            newErrors.insuranceImage = "Please upload the Insurance Image.."
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Don't proceed if there are validation errors
        }



        const submissionData = new FormData();

        submissionData.append("companyName", formData.companyName);
        submissionData.append("modelName", formData.modelName);
        submissionData.append("rentAmount", formData.rentAmount);
        submissionData.append("fuelType", formData.fuelType);
        submissionData.append("registerNumber", formData.registerNumber);
        submissionData.append("insuranceExpDate", formData.insuranceExpDate);
        submissionData.append("polutionExpDate", formData.polutionExpDate);

        formData.images.forEach((image) => {
            submissionData.append(`images`, image);
        });

        if (formData.rcImage) submissionData.append("rcImage", formData.rcImage);
        if (formData.insuranceImage) submissionData.append("insuranceImage", formData.insuranceImage);


        setIsSubmitting(true);

        try {
            const response = await saveBikeDetails(submissionData);

            if (response?.status === 200) {
                toast.success("Bike details registered successfully!");
                navigate('/hostSuccessPage')
            } else {
                toast.error("Failed to register bike details. Try again.");
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
                                <img src={rcImagePreview} alt="RC Preview" className="w-full h-full object-cover rounded" />
                                <button
                                    // onClick={handleRemoveRcImage}
                                    onClick={() => handleRemoveSingleImage("rcImage", setRcImagePreview)}

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
                                    // onClick={handleRemoveInsuranceImage}
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
                    className="bg-red-500  hover:bg-red-700 text-white font-serif font-bold py-2 px-4 mx-3 rounded"
                    onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BikeRegister;
