import { useEffect, useState } from "react";
import { deleteOffer, updateOffer, viewOffers } from "../../../Api/host";
import { useAppSelector } from "../../../Apps/store";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ViewOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [editedData, setEditedData] = useState<any>({});

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user;
  const userId = userDetails?.userId;

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await viewOffers(userId);
      setOffers(response.data.offer);
    } catch (error: any) {
      console.error("Error fetching offers:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (offerId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteOffer(offerId);
        setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
        Swal.fire("Deleted!", "The offer has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting offer:", error);
        Swal.fire("Error!", "Failed to delete the offer.", "error");
      }
    }
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setEditedData({
      ...offer,
      startDate: new Date(offer.startDate).toISOString().split("T")[0],
      endDate: new Date(offer.endDate).toISOString().split("T")[0],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editedData.offerName.trim()) {
      Swal.fire("Validation Error", "Offer name cannot be empty.", "error");
      return;
    }

    const discountValue = Number(editedData.discount);
    if (isNaN(discountValue) || discountValue <= 0) {
      Swal.fire("Validation Error", "Discount must be a number greater than 0.", "error");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(editedData.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(editedData.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      Swal.fire("Validation Error", "Start date cannot be in the past.", "error");
      return;
    }

    if (endDate <= startDate) {
      Swal.fire("Validation Error", "End date must be greater than start date.", "error");
      return;
    }
    try {
      await updateOffer(editingOffer._id, editedData);
      setOffers((prev) =>
        prev.map((offer) => (offer._id === editingOffer._id ? { ...offer, ...editedData } : offer))
      );
      setEditingOffer(null);
      Swal.fire("Success", "Offer updated successfully!", "success");
    } catch (error) {
      console.error("Error updating offer:", error);
      Swal.fire("Error!", "Failed to update the offer.", "error");
    }
  };

  const getStatusBadge = (offer:any) => {
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);

    if (now > endDate) {
      return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Expired</span>;
    } else if (now >= startDate) {
      return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>;
    } else {
      return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Upcoming</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Manage Offers</h2>
        
        {offers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <p className="text-lg text-gray-600">No offers available yet.</p>
            <p className="text-sm text-gray-500 mt-2">Create your first offer to attract more customers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {editingOffer?._id === offer._id ? (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Offer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
                        <input
                          type="text"
                          name="offerName"
                          value={editedData.offerName}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                        <input
                          type="number"
                          name="discount"
                          value={editedData.discount}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editedData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={editedData.startDate}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={editedData.endDate}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => setEditingOffer(null)} 
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdate} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{offer.offerName}</h3>
                            <div className="ml-3">{getStatusBadge(offer)}</div>
                          </div>
                          <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full mb-3">
                            <span className="text-2xl font-bold text-blue-700">{offer.discount}%</span>
                            <span className="ml-1 text-sm text-blue-600">Discount</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{offer.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <div>
                            <span className="font-medium">Start Date:</span>{" "}
                            {new Date(offer.startDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <div>
                            <span className="font-medium">End Date:</span>{" "}
                            {new Date(offer.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
                      <button 
                        onClick={() => handleEdit(offer)} 
                        className="px-4 py-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(offer._id)} 
                        className="px-4 py-2 flex items-center text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOffers;