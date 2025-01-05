import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick"; // Import the slick carousel
import { getBikeDetails } from "../../../Api/user"; // Your API call to fetch bike details

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAppSelector } from "../../../app/store";

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    phoneNumber: number | null;
    address: string;
    profile_picture: string | null;
    license_number: string | null;
    license_Exp_Date: Date | string;
    license_picture_front: string | null;
    license_picture_back: string | null;
}

interface BikeDetails {
    _id: string;
    userId: string;
    companyName: string;
    modelName: string;
    rentAmount: number | string;
    fuelType: string;
    images: string[];
    registerNumber: string;
    insuranceExpDate: Date | string;
    polutionExpDate: Date | string;
    rcImage: string | null;
    insuranceImage: string | null;
    userDetails: UserDetails;
}

const BikeSingleComp = () => {
    const { id } = useParams<{ id: string }>();
    const [bikeDetails, setBikeDetails] = useState<BikeDetails | null>(null);


    const authState = useAppSelector((state) => state.auth);
    const userIsPresent = authState.user

    const navigate = useNavigate()

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getBikeDetails(id!);
                console.log('bike details : ',response.bike);
                
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
        insuranceImage ,
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
            
            <button className="bg-sky-200 rounded pl-3 pr-3" onClick={()=>navigate(-1)}>Back</button>

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
            <div className="bg-gradient-to-b from-white to-sky-300 rounded-lg shadow p-6 mb-6 mt-6 text-center">
                <h1 className="text-xl font-bold mb-4">Bike Details</h1>
                <p><strong>Model Name:</strong> {modelName}</p>
                <p><strong>Company Name:</strong> {companyName}</p>
                <p><strong>Rent:</strong> ₹{rentAmount}/day</p>
                <p><strong>Fuel Type:</strong> {fuelType}</p>
                <p><strong>Register Number:</strong> {registerNumber}</p>
            </div>

            
            {/* Bike Documents */}
            {userIsPresent && (
                <div className="bg-gradient-to-b from-white to-sky-300 rounded-lg shadow p-6 mb-6 mt-6 items-center ">
                    <h1 className="text-xl font-bold mb-4">Bike Documents</h1>
                    <p><strong>Reg No:</strong> {registerNumber}</p>
                    <p><strong>Insurance Exp Date:</strong> {insuranceExpDate.toLocaleString()}</p>
                    <p><strong>Polution Exp Date:</strong> {polutionExpDate.toLocaleString()}</p>
                    <p><strong>rc Image:</strong></p>
                    <img
                        src={rcImage || "https://via.placeholder.com/150"}
                        alt={`${modelName}`}
                    />

                    <p><strong>Insurance Image:</strong></p>
                    <img
                        src={insuranceImage || "https://via.placeholder.com/150"}
                        alt={`${modelName}`}
                    />
                </div>
            )}

            {/* Owner Details */}
            
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
    );
};

export default BikeSingleComp;
