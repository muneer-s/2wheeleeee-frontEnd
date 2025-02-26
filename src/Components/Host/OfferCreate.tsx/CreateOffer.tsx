import React, { useState } from "react";
import toast from "react-hot-toast";
import { createOffer } from "../../../Api/host";
import { useAppSelector } from "../../../Apps/store";

const CreateOffer: React.FC = () => {
    const [formData, setFormData] = useState({
        offerName: "",
        discount: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const [errors, setErrors] = useState({
        offerName: "",
        discount: "",
        startDate: "",
        endDate: "",
    });


    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user
    const userId = userDetails.userId

    const validateForm = () => {
        let valid = true;
        const newErrors = { offerName: "", discount: "", startDate: "", endDate: "" };
        const today = new Date().toISOString().split("T")[0];

        if (!formData.offerName.trim()) {
            newErrors.offerName = "Offer name is required";
            valid = false;
        }
        if (!formData.discount) {
            newErrors.discount = "Discount is required";
            valid = false;
        } else {
            const discountValue = parseFloat(formData.discount);
            if (isNaN(discountValue) || discountValue <= 0) {
                newErrors.discount = "Discount must be a number greater than 0";
                valid = false;
            }
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start date is required";
            valid = false;
        } else if (formData.startDate < today) {
            newErrors.startDate = "Start date must be greater than today";
            valid = false;
        }

        if (!formData.endDate) {
            newErrors.endDate = "End date is required";
            valid = false;
        } else if (formData.endDate < today) {
            newErrors.endDate = "End date must be greater than today";
            valid = false;
        } else if (formData.startDate && formData.startDate >= formData.endDate) {
            newErrors.endDate = "End date must be after the start date";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataWithUser = { ...formData, createdBy: userId };

        try {
            await createOffer(formDataWithUser)
            toast.success("Offer Created Successfully!");
            setFormData({ offerName: "", discount: "", startDate: "", endDate: "", description: "" });
        } catch (error) {
            console.error("Error creating offer:", error);
            toast.error("Failed to create offer.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Create Offer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Offer Name */}
                <div>
                    <label className="block text-sm font-medium">Offer Name</label>
                    <input
                        type="text"
                        name="offerName"
                        value={formData.offerName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.offerName && <p className="text-red-500">{errors.offerName}</p>}
                </div>

                {/* Discount */}
                <div>
                    <label className="block text-sm font-medium">Discount (%)</label>
                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.discount && <p className="text-red-500">{errors.discount}</p>}
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Create Offer
                </button>
            </form>
        </div>
    );
};

export default CreateOffer;
