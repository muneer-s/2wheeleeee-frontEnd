import React, { useState } from "react";
import toast from "react-hot-toast";

const EditOffer: React.FC = () => {

  
   const handleSubmit = ()=>{
    
   }


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
                        className="w-full p-2 border rounded"
                    />
                    {/* {errors.offerName && <p className="text-red-500">{errors.offerName}</p>} */}
                </div>

                {/* Discount */}
                <div>
                    <label className="block text-sm font-medium">Discount (%)</label>
                    <input
                        type="number"
                        name="discount"
                        
                        className="w-full p-2 border rounded"
                    />
                    {/* {errors.discount && <p className="text-red-500">{errors.discount}</p>} */}
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        className="w-full p-2 border rounded"
                    />
                    {/* {errors.startDate && <p className="text-red-500">{errors.startDate}</p>} */}
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                     
                        className="w-full p-2 border rounded"
                    />
                    {/* {errors.endDate && <p className="text-red-500">{errors.endDate}</p>} */}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        
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

export default EditOffer;
