import { useLocation } from "react-router-dom";
import { isEditOn, verifyHost } from "../../../Api/admin";
import { useState } from "react";
import { BikeData } from "../../../Interfaces/BikeInterface";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import toast from "react-hot-toast";

const HostSingleViewComp = () => {
  const location = useLocation();
  const { bike } = location.state || {};
  const [isHostVerified, setIsHostVerified] = useState(bike?.isHost || false);
  const [loadingState, setLoadingState] = useState({ verifyHost: false, editExpiry: false });
  const [revokeReason, setRevokeReason] = useState("")

  if (!bike) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-red-600">No bike details found.</p>
      </div>
    );
  }

  const handleVerifyHost = async () => {
    setLoadingState((prev) => ({ ...prev, verifyHost: true }));
    try {

      const payload = isHostVerified
        ? { reason: revokeReason }
        : null;

      if (isHostVerified && !revokeReason.trim()) {
        toast.error("Please provide a reason for revoking.");
        return;
      }

      const result = await verifyHost(bike._id, payload);
      console.log(111, result)

      if (result.success) {
        setIsHostVerified((prev: BikeData) => !prev);
        toast.success(
          isHostVerified
            ? "Host status revoked successfully!"
            : "Host verified successfully!"
        );
        setRevokeReason("");
      }
    } catch (error) {
      console.error("Error verifying host:", error);
      toast.error("Failed to update host status.");
    } finally {
      setLoadingState((prev) => ({ ...prev, verifyHost: false }));
    }
  };

  const isInsuranceExpired = new Date(bike.insuranceExpDate) < new Date();
  const isPollutionExpired = new Date(bike.polutionExpDate) < new Date();

  const handleEditExpiry = async () => {
    setLoadingState((prev) => ({ ...prev, editExpiry: true }));
    try {
      const result = await isEditOn(bike._id);
      console.log(2222, result)

      if (result.success) {
        toast.success("Admin sent a request to edit bike details.");
      }
    } catch (error) {
      console.error("Error in isEditOn:", error);
    } finally {
      setLoadingState((prev) => ({ ...prev, editExpiry: false }));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      {/* User Details Section */}
      <div className="p-6 bg-gray-100 border-t rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Details</h2>
        <div className="flex flex-col sm:flex-row items-center sm:gap-4">
          <img
            src={bike.userDetails.profile_picture}
            alt={bike.userDetails.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md mb-4 sm:mb-0"
          />
          <div className="text-center sm:text-left space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {bike.userDetails.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {bike.userDetails.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {bike.userDetails.phoneNumber}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {bike.userDetails.address}
            </p>
          </div>
        </div>
      </div>

      {/* Bike Details Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bike Details</h2>
        <div className="space-y-4">

          <h1 className="text-xl font-semibold text-gray-700">{bike.modelName}</h1>
          <p className="text-gray-600">
            <span className="font-semibold">Company:</span> {bike.companyName}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Rent:</span> ₹{bike.rentAmount}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Fuel Type:</span> {bike.fuelType}
          </p>


          {/* Expiry Information */}
          <div className="mt-6 space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Reg No:</span> {bike.registerNumber}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Insurance Exp Date:</span>{" "}
              {new Date(bike.insuranceExpDate).toISOString().split("T")[0]}{" "}
              {isInsuranceExpired && (
                <span className="text-red-600 font-bold">Expired</span>
              )}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Pollution Exp Date:</span>{" "}
              {new Date(bike.polutionExpDate).toISOString().split("T")[0]}{" "}
              {isPollutionExpired && (
                <span className="text-red-600 font-bold">Expired</span>
              )}
            </p>
            {(isInsuranceExpired || isPollutionExpired) && (
              <button
                disabled={loadingState.editExpiry}
                onClick={handleEditExpiry}
                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                {loadingState.editExpiry ? "Processing..." : "Edit"}
              </button>
            )}
          </div>

          {/* Host Status */}
          <p className="text-gray-600">
            <span className="font-semibold">Is Host:</span>{" "}
            {isHostVerified ? "Approved" : "Pending"}
          </p>
          {isHostVerified && (
            <div className="mt-2">
              <label htmlFor="revokeReason" className="block text-sm font-medium text-gray-700">
                Reason for Revoking:
              </label>
              <input
                id="revokeReason"
                type="text"
                placeholder="Enter reason"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          )}
          <button
            onClick={handleVerifyHost}
            className={`px-4 py-2 text-white rounded ${loadingState.verifyHost ? "opacity-50 cursor-not-allowed" : ""} ${isHostVerified ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            disabled={loadingState.verifyHost}
          >
            {loadingState.verifyHost
              ? "Processing..."
              : isHostVerified
                ? "Revoke"
                : "Approve"}
          </button>
        </div>

        {/* Bike Images */}
        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Images</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {bike.images.map((image: string, index: number) => (
            <Zoom key={index}>
              <img
                src={image}
                alt={`Bike Image ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg shadow-sm"
              />
            </Zoom>
          ))}
        </div>

        {/* Document Images */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 font-semibold">RC Image:</p>
            <Zoom>
              <img
                src={bike.rcImage}
                alt="RC Document"
                className="w-full max-w-md lg:max-w-sm xl:max-w-xs max-h-80 lg:max-h-60 xl:max-h-48 object-cover rounded-lg shadow-sm mt-2"
              />
            </Zoom>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Insurance Image:</p>
            <Zoom>
              <img
                src={bike.insuranceImage}
                alt="Insurance Document"
                className="w-full max-w-md lg:max-w-sm xl:max-w-xs max-h-80 lg:max-h-60 xl:max-h-48 object-cover rounded-lg shadow-sm mt-2"
              />
            </Zoom>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Polution Image:</p>
            <Zoom>
              <img
                src={bike.PolutionImage}
                alt="Insurance Document"
                className="w-full max-w-md lg:max-w-sm xl:max-w-xs max-h-80 lg:max-h-60 xl:max-h-48 object-cover rounded-lg shadow-sm mt-2"
              />
            </Zoom>
          </div>

        </div>



      </div>
    </div>
  );
};

export default HostSingleViewComp;
