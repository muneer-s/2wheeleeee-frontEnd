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
      toast.error(error.response.data.message)
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Offers</h2>
      {offers.length === 0 ? (
        <p>No offers available.</p>
      ) : (
        <ul className="space-y-3">
          {offers.map((offer) => (
            <li key={offer._id} className="p-4 border rounded shadow">
              {editingOffer?._id === offer._id ? (
                <div>
                  <p>Offer Name</p>
                  <input
                    type="text"
                    name="offerName"
                    value={editedData.offerName}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                  <p>Discount </p>
                  <input
                    type="number"
                    name="discount"
                    value={editedData.discount}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                  <p>Description</p>
                  <textarea
                    name="description"
                    value={editedData.description}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                  <p>Start Date</p>
                  <input
                    type="date"
                    name="startDate"
                    value={editedData.startDate}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                  <p>End Date</p>
                  <input
                    type="date"
                    name="endDate"
                    value={editedData.endDate}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditingOffer(null)} className="ml-2 text-red-500">
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">Offer Name : {offer.offerName}</h3>
                  <p>Discount: {offer.discount}%</p>
                  {/* <p>Start Date: {new Date(offer.startDate).toLocaleDateString()}</p> */}
                  <p>
                    Start Date: {new Date(offer.startDate).toLocaleDateString()}{" "}
                    {new Date(offer.startDate) < new Date() && (
                      <span className="text-red-500 font-semibold">(Started)</span>
                    )}
                  </p>


                  {/* <p>End Date: {new Date(offer.endDate).toLocaleDateString()}</p> */}

                  <p>
                    End Date: {new Date(offer.endDate).toLocaleDateString()}{" "}
                    {new Date(offer.endDate) < new Date() && (
                      <span className="text-red-500 font-semibold">(Expired)</span>
                    )}
                  </p>


                  <p>Description : {offer.description}</p>
                  <button onClick={() => handleEdit(offer)} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="bg-red-500 text-white px-4 py-2 ml-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewOffers;
