import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import { getBikeDetails, orderPlacing } from "../../../Api/user";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAppSelector } from "../../../Apps/store";
import { IBikeDetailsWithUserDetails } from "../../../Interfaces/User/IUser";
import { handleApiResponse } from "../../../Utils/apiUtils";
import toast from "react-hot-toast";


const BikeSingleComp = () => {
    const { id } = useParams<{ id: string }>();


    const [bikeDetails, setBikeDetails] = useState<IBikeDetailsWithUserDetails | null>(null);
    const [zoomed, setZoomed] = useState<number | null>(null);
    const [transformOrigin, setTransformOrigin] = useState<string>("50% 50%");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    //const [error, setError] = useState<string>("");
    const [totalRent, setTotalRent] = useState(0);
    //const [paymentMethod, setPaymentMethod] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState<number | null>(null);


    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);





    const today = new Date().toISOString().split("T")[0];

    const authState = useAppSelector((state) => state.auth);
    const userIsPresent = authState.user

    const navigate = useNavigate()

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getBikeDetails(id!);

                const BikeData = handleApiResponse(response)

                setBikeDetails(BikeData);
            } catch (error) {
                console.error("Error fetching bike details:", error);
                toast.error('Error while fetching Bike data')
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

    // zooming
    const handleMouseOver = (index: number) => {
        setZoomed(index);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        if (zoomed !== null) {
            const img = e.currentTarget;
            const { left, top, width, height } = img.getBoundingClientRect();
            const offsetX = ((e.clientX - left) / width) * 100;
            const offsetY = ((e.clientY - top) / height) * 100;
            setTransformOrigin(`${offsetX}% ${offsetY}%`);
        }
    };

    const handleMouseLeave = () => {
        setZoomed(null);
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    const calculateTotalRent = (start: string | Date, end: string | Date) => {
        if (start && end) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);

            if (endDateObj.getTime() === startDateObj.getTime()) {
                const differenceInTime = 24
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
                setTotalRent(differenceInDays * rentAmount);
            } else if (endDateObj > startDateObj) {
                //const differenceInTime = endDateObj.getTime() - startDateObj.getTime() + 1;
                //const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
                const differenceInDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24)) + 1;

                setTotalRent(differenceInDays * rentAmount);
            } else {
                setTotalRent(0);
            }
        } else {
            setTotalRent(0);
        }
    };

    const handleSubmit = async() => {

        if (!endDate || !startDate) {
            setError("Please select the start date and end date");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError("End date must be greater than start date.");
            return;
        }

        if (!paymentMethod) {
            setError("Please select a payment method.");
            return;
        }

        setError("");

        try {
            if(!userIsPresent){
                toast.error("Please login first")
                navigate('/login')
                return
            }

           

            const orderData = {
                bikeId : bikeDetails._id,
                startDate,
                endDate,
                userId: userIsPresent.userId,
                paymentMethod,
              };

              const response = await orderPlacing(orderData);
              toast.success(response.message)
        
              console.log('Order placed successfully:', response);
            } catch (error) {
              console.error('Error placing order:', error);
              alert('Failed to place order. Please try again.');
            }
    };

    return (
        <div className="min-h-screen container mx-auto p-6 bg-gradient-to-b from-white to-sky-300">

            <button className="bg-sky-200 rounded pl-3 pr-3" onClick={() => navigate(-1)}>Back</button>
            <div>
                <div className="mb-4">
                    <Slider {...settings}>
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image || "https://via.placeholder.com/150"}
                                    alt={`${companyName} ${modelName}`}
                                    className={`mx-auto w-auto h-64 object-cover transition-transform duration-300 ${zoomed === index ? "scale-[2.3]" : "scale-100"
                                        }`}
                                    style={{
                                        transformOrigin: transformOrigin,
                                    }}
                                    onMouseOver={() => handleMouseOver(index)}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>


            {/* Bike Details */}
            <div className="bg-gradient-to-b from-white to-sky-300 rounded-lg shadow p-6 mb-6 mt-6 text-center flex">
                <div className="bg-gradient-to-b from-white to-sky-300 rounded-lg shadow p-6 mb-6 mt-6 text-center w-2/3">

                    <h1 className="text-xl items-center font-bold mb-4">Bike Details</h1>

                    <div className="flex justify-between">
                        <div className="ml-36">
                            <p><strong>Model Name:</strong> {modelName}</p>
                            <p><strong>Company Name:</strong> {companyName}</p>
                            <p><strong>Rent:</strong> ₹{rentAmount}/day</p>
                            <p><strong>Fuel Type:</strong> {fuelType}</p>
                        </div>
                        <div className="">
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
                    </div>
                </div>
                {/* Place the Order Section */}

                <div className="ml-36 bg-sky-500 w-1/3 rounded p-6 text-white">

                    {/* Updated Heading  */}
                    <h1 className="text-2xl font-bold text-center mb-4">Place the Order</h1>
                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <p><strong>Rent amount per day:</strong> ₹{rentAmount}/day</p>

                    {/* Start Date Field */}
                    <div className="mt-4 flex items-center">
                        <label className="w-1/2 font-semibold">Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                calculateTotalRent(e.target.value, endDate);
                            }}
                            min={today}
                            className="p-2 w-1/2 rounded text-black"
                        />
                    </div>
                    {/* End Date Field */}

                    <div className="mt-2 flex items-center">
                        <label className="w-1/2 font-semibold">End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                calculateTotalRent(startDate, e.target.value);
                            }}
                            min={today}
                            className="p-2 w-1/2 rounded text-black"
                        />

                    </div>

                    {/* Display Total Rent */}
                    <p className="mt-4 text-lg"><strong>Total Rent:</strong> ₹{totalRent}</p>

                    {/* Payment Method Selection */}
                    <div className="mt-4 bg-sky-500 p-3">
                        <label className="block font-semibold mb-2">Select Payment Method:</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="razorpay"
                                checked={paymentMethod === "razorpay"}
                                onChange={() => setPaymentMethod("razorpay")}
                                className="w-4 h-4"
                            />
                            <label htmlFor="razorpay">Razorpay</label>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="wallet"
                                checked={paymentMethod === "wallet"}
                                onChange={() => setPaymentMethod("wallet")}
                                className="w-4 h-4"
                            />
                            <label htmlFor="wallet">Wallet</label>
                        </div>
                    </div>



                    {/* Order Now Button */}
                    <button
                        className="bg-blue-950 rounded-md p-3 w-full mt-6 font-semibold hover:bg-blue-800"
                        onClick={handleSubmit}
                    >
                        Order Now
                    </button>

                    

                </div>

            </div>

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
