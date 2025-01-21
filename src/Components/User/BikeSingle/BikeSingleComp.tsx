import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick"; // Import the slick carousel
import { getBikeDetails } from "../../../Api/user"; // Your API call to fetch bike details

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAppSelector } from "../../../Apps/store";
import { IBikeDetailsWithUserDetails } from "../../../Interfaces/User/IUser";


const BikeSingleComp = () => {
    const { id } = useParams<{ id: string }>();
    const [bikeDetails, setBikeDetails] = useState<IBikeDetailsWithUserDetails | null>(null);


    const authState = useAppSelector((state) => state.auth);
    const userIsPresent = authState.user

    const navigate = useNavigate()

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getBikeDetails(id!);
                console.log('bike details : ', response.bike);

                setBikeDetails(response.bike);
            } catch (error) {
                console.error("Error fetching bike details:", error);
            }
        };

        fetchDetails();
    }, [id]);

    if (!bikeDetails) return <p>Loading bike details...</p>;

    const { companyName,
        modelName,
        rentAmount,
        fuelType,
        images,
        registerNumber,
        insuranceExpDate,
        polutionExpDate,
        rcImage,
        insuranceImage,
        PolutionImage,
        userDetails } = bikeDetails;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="min-h-screen container mx-auto p-6 bg-gradient-to-b from-white to-sky-300">

            <button className="bg-sky-200 rounded pl-3 pr-3" onClick={() => navigate(-1)}>Back</button>

            {/* Image Carousel */}
            <div className="mb-4">
                <Slider {...settings}>
                    {images.map((image, index) => (
                        <div key={index}>
                            <img
                                src={image || "https://via.placeholder.com/150"}
                                alt={`${companyName} ${modelName}`}
                                className="mx-auto w-auto h-64 object-cover "
                            />
                        </div>
                    ))}
                </Slider>
            </div>


            {/* Bike Details */}
            <div className="flex justify-between">
                <div className="bg-gradient-to-b from-white to-sky-300 rounded-lg shadow p-6 mb-6 mt-6 text-center">
                    <h1 className="text-xl font-bold mb-4">Bike Details</h1>
                    <p><strong>Model Name:</strong> {modelName}</p>
                    <p><strong>Company Name:</strong> {companyName}</p>
                    <p><strong>Rent:</strong> ₹{rentAmount}/day</p>
                    <p><strong>Fuel Type:</strong> {fuelType}</p>
                    <p><strong>Register Number:</strong> {registerNumber}</p>
                    <p><strong>Reg No:</strong> {registerNumber}</p>
                    <p>
                        <strong>Insurance Exp Date:</strong> {new Date(insuranceExpDate).toISOString().split("T")[0]}{" "}
                        {new Date(insuranceExpDate) <= new Date() ? (
                            <span className="text-red-500">(Expired)</span>
                        ) : (
                            <span className="text-green-500">(Valid)</span>
                        )}
                    </p>
                    <p>
                        <strong>Polution Exp Date:</strong> {new Date(polutionExpDate).toISOString().split("T")[0]}{" "}
                        {new Date(polutionExpDate) <= new Date() ? (
                            <span className="text-red-500">(Expired)</span>
                        ) : (
                            <span className="text-green-500">(Valid)</span>
                        )}
                    </p>
                </div>
                {userIsPresent && (
                <div className="bg-gradient-to-b from-white to-sky-300 rounded-lg shadow p-6 mb-6 mt-6 flex flex-wrap gap-6 justify-between items-center">
                    {/* RC Image Section */}
                    <div className="flex flex-col items-center">
                        <p className="font-semibold mb-2">RC Image:</p>
                        <img
                            src={rcImage || "https://via.placeholder.com/150"}
                            alt={`${modelName} RC`}
                            className="w-40 h-40 object-cover rounded"
                        />
                    </div>

                    {/* Insurance Image Section */}
                    <div className="flex flex-col items-center">
                        <p className="font-semibold mb-2">Insurance Image:</p>
                        <img
                            src={insuranceImage || "https://via.placeholder.com/150"}
                            alt={`${modelName} Insurance`}
                            className="w-40 h-40 object-cover rounded"
                        />
                    </div>

                    {/* Pollution Image Section */}
                    <div className="flex flex-col items-center">
                        <p className="font-semibold mb-2">Pollution Image:</p>
                        <img
                            src={PolutionImage || "https://via.placeholder.com/150"}
                            alt={`${modelName} Pollution`}
                            className="w-40 h-40 object-cover rounded"
                        />
                    </div>
                </div>

            )}



                {userIsPresent && userDetails && (
                    <div className="bg-gradient-to-b from-white to-sky-300 rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Owner Details</h2>
                        <p><strong>Name:</strong> {userDetails.name}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                        <p><strong>Phone:</strong> {userDetails.phoneNumber || "Not provided"}</p>
                        <p><strong>Address:</strong> {userDetails.address || "Not provided"}</p>
                        <img
                            src={userDetails.profile_picture || "https://via.placeholder.com/150"}
                            alt={`${userDetails.name}'s Profile`}
                            className="w-24 h-24 object-cover rounded-full mt-4"
                        />
                    </div>
                )}




            </div>








          

            {/* Owner Details */}


        </div>
    );
};

export default BikeSingleComp;
