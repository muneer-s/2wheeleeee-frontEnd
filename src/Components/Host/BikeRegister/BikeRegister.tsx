import React, { useState } from "react";
import toast from "react-hot-toast";
import { saveBikeDetails } from "../../../Api/host";
import { BikeData } from "../../../Interfaces/BikeInterface";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";




const BikeRegister = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.userId;


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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
    
    // Remove RC Image
    // const handleRemoveRcImage = () => {
    //     setFormData({ ...formData, rcImage: null });
    //     setRcImagePreview(null);
    // };

    // // Remove Insurance Image
    // const handleRemoveInsuranceImage = () => {
    //     setFormData({ ...formData, insuranceImage: null });
    //     setInsuranceImagePreview(null);
    // };

    const handleSubmit = async () => {

        if (!formData.companyName.trim()) {
            toast.error("Company name is required.");
            return;
        }
        if (!formData.modelName.trim()) {
            toast.error("Model name is required.");
            return;
        }
        if (!formData.rentAmount.trim() || isNaN(Number(formData.rentAmount))) {
            toast.error("Rent amount must be a valid number.");
            return;
        }
        if (!formData.fuelType || formData.fuelType === "Select Fuel Type") {
            toast.error("Please select a fuel type (Petrol or Electric).");
            return;
        }
        if (formData.images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }
        if (formData.images.length > 4) {
            toast.error("You can upload a maximum of 4 images.");
            return;
        }
        if (!formData.registerNumber.trim()) {
            toast.error("Register number is required.");
            return;
        }


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.insuranceExpDate.trim()) {
            toast.error("Insurance expiry date is required.");
            return;
        }
        if (formData.insuranceExpDate) {
            const insuranceExpDate = new Date(formData.insuranceExpDate);
            if (insuranceExpDate < today) {
                toast.error("Insurance expiry date cannot be earlier than today.");
                return;
            }
        }

        if (!formData.polutionExpDate.trim()) {
            toast.error("Pollution expiry date is required.");
            return;
        } 
        if(formData.polutionExpDate) {
            const polutionExpDate = new Date(formData.polutionExpDate);
            if (polutionExpDate < today) {
                toast.error("Pollution expiry date cannot be earlier than today.");
                return;
            }
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

        if (userId) {
            submissionData.append("userId", userId);
        }

        try {
            const response = await saveBikeDetails(submissionData);
            console.log('bike -------', response);

            if (response?.status === 200) {
                toast.success("Bike details registered successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error("Failed to register bike details. Try again.");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the data.");
            console.error("Error:", error);
        }

    }


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
                    </div>

                    {/* Rent Amount */}
                    <div>
                        <label className="block text-gray-700">Rent Amount Per Hour</label>
                        <input
                            type="text"
                            name="rentAmount"
                            placeholder="Amount Per Hour"
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
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
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BikeRegister;
