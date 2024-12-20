import { useLocation } from "react-router-dom";
import { verifyHost } from "../../../Api/admin";
import { useState } from "react";
import { BikeData } from "../../../Interfaces/BikeInterface";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";


const HostSingleViewComp = () => {

  const location = useLocation();
  const { bike } = location.state || {};
  const [isHostVerified, setIsHostVerified] = useState(bike?.isHost || false);


  if (!bike) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-red-600">No bike details found.</p>
      </div>
    );
  }


  const handleVerifyHost = async () => {
    try {
      const result = await verifyHost(bike._id); // Assuming `bike._id` is the unique ID
      console.log("1010101----", result);


      if (result?.status === 200) {
        setIsHostVerified((prev: BikeData) => !prev); // Toggle the verification status
      }
    } catch (error) {
      console.error("Error verifying host:", error);
    }
  };






  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* User Details Section */}
        <div className="p-6 bg-gray-100 border-t">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Details</h2>
          <div className="flex items-center gap-4">
            <img
              src={bike.userDetails.profile_picture}
              alt={bike.userDetails.name}
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
            <div>
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
        <div className="p-6">
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


            {/* Additional Bike Info */}
            <div className="mt-6 space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold">Reg No:</span> {bike.registerNumber}
              </p>
              {/* <p className="text-gray-600">
                <span className="font-semibold">Insurance Exp Date:</span> {bike.insuranceExpDate}
              </p> */}

              <p className="text-gray-600">
                <span className="font-semibold">Insurance Exp Date:</span>{" "}
                {new Date(bike.insuranceExpDate).toISOString().split("T")[0]}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold">Pollution Exp Date:</span>{" "}
                {new Date(bike.polutionExpDate).toISOString().split("T")[0]}
              </p>
            </div>

            <p className="text-gray-600">
              <span className="font-semibold">Is Host:</span>{" "}
              {isHostVerified ? "Approved" : "Pending"}
            </p>
            <button
              onClick={handleVerifyHost}
              className={`px-4 py-2 text-white rounded ${isHostVerified ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {isHostVerified ? "Revoke" : "Approve"}
            </button>



          </div>

          {/* Bike Images */}
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {bike.images.map((image: string, index: number) => (
              <Zoom key={index}>

                <img
                  key={index}
                  src={image}
                  alt={`Bike Image ${index + 1}`}
                  className="w-auto h-auto object-cover rounded-lg shadow-sm"
                />
              </Zoom>
            ))}
          </div>



          {/* Document Images */}
          <div className="mt-6 place-items-center">
            <p className="text-gray-600 font-semibold">RC Image:</p>
            <Zoom>
              <img
                src={bike.rcImage}
                alt="RC Document"
                className="w-auto h-auto object-cover rounded-lg shadow-sm mt-2"
              />
            </Zoom>

            <p className="text-gray-600 font-semibold mt-4">Insurance Image:</p>
            <Zoom>
              <img
                src={bike.insuranceImage}
                alt="Insurance Document"
                className="w-auto h-auto object-cover rounded-lg shadow-sm mt-2"
              />
            </Zoom>

          </div>
        </div>


      </div>
    </div>
  );
}

export default HostSingleViewComp




