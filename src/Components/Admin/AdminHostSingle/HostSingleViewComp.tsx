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
  const [revokeReason, setRevokeReason] = useState("");

  if (!bike) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="p-8 bg-white rounded-xl shadow-xl">
          <p className="text-xl font-semibold text-red-600">No bike details found.</p>
        </div>
      </div>
    );
  }

  const handleVerifyHost = async () => {
    setLoadingState((prev) => ({ ...prev, verifyHost: true }));
    try {
      const payload = isHostVerified ? { reason: revokeReason } : null;

      if (isHostVerified && !revokeReason.trim()) {
        toast.error("Please provide a reason for revoking.");
        return;
      }

      const result = await verifyHost(bike._id, payload);

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

      if (result.success) {
        toast.success("Admin sent a request to edit bike details.");
      }
    } catch (error) {
      console.error("Error in isEditOn:", error);
    } finally {
      setLoadingState((prev) => ({ ...prev, editExpiry: false }));
    }
  };

  const formatDate = (dateString:any) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with bike model name */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h1 className="text-3xl font-bold text-white">{bike.modelName}</h1>
            <div className="flex items-center mt-2">
              <span className="bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {bike.companyName}
              </span>
              <span className="ml-4 bg-green-200 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                ₹{bike.rentAmount}/day
              </span>
              <span className="ml-4 bg-purple-200 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {bike.fuelType}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: User Details */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
              <h2 className="text-xl font-bold text-white">User Details</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <img
                    src={bike.userDetails.profile_picture}
                    alt={bike.userDetails.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full ${isHostVerified ? 'bg-green-500' : 'bg-yellow-500'} border-2 border-white`}></div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-800">{bike.userDetails.name}</h3>
                <p className="text-gray-500">{isHostVerified ? "Verified Host" : "Pending Verification"}</p>
              </div>

              <div className="space-y-4 divide-y divide-gray-100">
                <div className="flex items-center py-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-700">{bike.userDetails.email}</p>
                  </div>
                </div>

                <div className="flex items-center py-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-gray-700">{bike.userDetails.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center py-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-gray-700">{bike.userDetails.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {isHostVerified && (
                  <div className="mb-4">
                    <label htmlFor="revokeReason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Revoking:
                    </label>
                    <input
                      id="revokeReason"
                      type="text"
                      placeholder="Enter reason"
                      value={revokeReason}
                      onChange={(e) => setRevokeReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                )}
                <button
                  onClick={handleVerifyHost}
                  className={`w-full py-3 text-white rounded-lg shadow-md transition duration-300 flex items-center justify-center ${
                    loadingState.verifyHost ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isHostVerified 
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  }`}
                  disabled={loadingState.verifyHost}
                >
                  {loadingState.verifyHost ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : isHostVerified ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Revoke Host Status
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Approve Host Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Middle column: Bike Details & Documents */}
          <div className="space-y-8">
            {/* Bike Registration Details */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 p-4">
                <h2 className="text-xl font-bold text-white">Registration Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="text-xl font-semibold text-gray-800">{bike.registerNumber}</p>
                  </div>
                  
                  {/* Insurance Expiry */}
                  <div className={`p-4 rounded-xl ${isInsuranceExpired ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Insurance Expiry</p>
                        <p className="text-lg font-semibold text-gray-800">{formatDate(bike.insuranceExpDate)}</p>
                      </div>
                      {isInsuranceExpired && (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Expired</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Pollution Expiry */}
                  <div className={`p-4 rounded-xl ${isPollutionExpired ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Pollution Expiry</p>
                        <p className="text-lg font-semibold text-gray-800">{formatDate(bike.polutionExpDate)}</p>
                      </div>
                      {isPollutionExpired && (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Expired</span>
                      )}
                    </div>
                  </div>
                </div>

                {(isInsuranceExpired || isPollutionExpired) && (
                  <button
                    disabled={loadingState.editExpiry}
                    onClick={handleEditExpiry}
                    className="mt-6 w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 flex items-center justify-center"
                  >
                    {loadingState.editExpiry ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Request Edit
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-4">
                <h2 className="text-xl font-bold text-white">Documents</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">RC Document</p>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <Zoom>
                        <img
                          src={bike.rcImage}
                          alt="RC Document"
                          className="w-full h-auto object-cover rounded-lg"
                        />
                      </Zoom>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Insurance Certificate</p>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <Zoom>
                        <img
                          src={bike.insuranceImage}
                          alt="Insurance Document"
                          className="w-full h-auto object-cover rounded-lg"
                        />
                      </Zoom>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Pollution Certificate</p>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <Zoom>
                        <img
                          src={bike.PolutionImage}
                          alt="Pollution Document"
                          className="w-full h-auto object-cover rounded-lg"
                        />
                      </Zoom>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Bike Images */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-800 to-green-900 p-4">
              <h2 className="text-xl font-bold text-white">Bike Gallery</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {bike.images.map((image: string | undefined, index: any) => (
                  <div key={index} className="bg-gray-50 p-2 rounded-lg">
                    <Zoom>
                      <img
                        src={image}
                        alt={`Bike Image ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </Zoom>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostSingleViewComp;