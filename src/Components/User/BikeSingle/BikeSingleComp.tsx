import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import { createOrder, getBikeDetails, getProfile, getWalletBalance, isAlreadyBooked, orderPlacing } from "../../../Api/user";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppSelector } from "../../../Apps/store";
import { IBikeDetailsWithUserDetails } from "../../../Interfaces/User/IUser";
import { handleApiResponse } from "../../../Utils/apiUtils";
import toast from "react-hot-toast";
import Api from "../../../service/axios";
import userRoutes from "../../../service/endPoints/userEndPoints";
import { isAdminVerifyUser } from "../../../Api/host";
import Review from "./Components/Review";
import Swal from "sweetalert2";

const BikeSingleComp = () => {
    const { id } = useParams<{ id: string }>();
    const { Razorpay } = useRazorpay();
    const navigate = useNavigate();

    const [bikeDetails, setBikeDetails] = useState<IBikeDetailsWithUserDetails | null>(null);
    const [zoomed, setZoomed] = useState<number | null>(null);
    const [transformOrigin, setTransformOrigin] = useState<string>("50% 50%");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalRent, setTotalRent] = useState(0);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);

    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    const authState = useAppSelector((state) => state.auth);
    const userEmail = authState.user?.email || '';
    const userIsPresent = authState.user ?? null;
    const userId = userIsPresent?.userId ?? '';

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await getBikeDetails(id!);
                const BikeData = handleApiResponse(response);
                setBikeDetails(BikeData);
            } catch (error) {
                console.error("Error fetching bike details:", error);
                toast.error('Error while fetching Bike data');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProfile(userEmail);
                const userDetails = handleApiResponse(response);

                if (response.success) {
                    if (userDetails.wallet) {
                        const walletResponse = await getWalletBalance(userDetails.wallet);

                        if (walletResponse.success) {
                            setWalletBalance(walletResponse.data.balance);
                        } else {
                            toast.error(walletResponse.message);
                        }
                    }
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('catch Error get profile:', error);
            }
        };

        if (userIsPresent) {
            fetchData();
        }
    }, [userEmail, userIsPresent]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sky-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
                    <p className="text-xl text-gray-700">Loading bike details...</p>
                </div>
            </div>
        );
    }

    if (!bikeDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sky-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <p className="text-xl text-gray-700">Bike details not found</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const {
        companyName,
        modelName,
        rentAmount,
        fuelType,
        images,
        registerNumber,
        insuranceExpDate,
        polutionExpDate,
        userDetails,
        location
    } = bikeDetails;

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
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: true,
    };

    const calculateTotalRent = (start: string | Date, end: string | Date) => {
        if (start && end) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);

            if (endDateObj.getTime() === startDateObj.getTime()) {
                const differenceInTime = 24;
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

                if (bikeDetails.offerApplied) {
                    setTotalRent(differenceInDays * (bikeDetails.offerPrice ?? rentAmount));
                } else {
                    setTotalRent(differenceInDays * rentAmount);
                }
            } else if (endDateObj > startDateObj) {
                const differenceInDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24)) + 1;
                if (bikeDetails.offerApplied) {
                    setTotalRent(differenceInDays * (bikeDetails.offerPrice ?? rentAmount));
                } else {
                    setTotalRent(differenceInDays * rentAmount);
                }
            } else {
                setTotalRent(0);
            }
        } else {
            setTotalRent(0);
        }
    };

    const handleSubmit = async () => {
        if (userId == bikeDetails.userId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "It's Your Bike! Can't Book!",
            });
            return;
        }

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
            if (!userIsPresent) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please login first!",
                });
                navigate('/login');
                return;
            }

            const response1 = await isAdminVerifyUser(userId);
            const data = handleApiResponse(response1);

            if (!data.user?.isUser) {
                Swal.fire({
                    icon: "error",
                    title: "Sorry!",
                    text: "Can't make booking, user is not verified!",
                });
                return;
            }

            const result = await isAlreadyBooked(bikeDetails?._id);
            if (result.data.bikeOrdered) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "This bike is already booked! Please try later.",
                });
                return;
            }

            const orderData = {
                bikeId: bikeDetails._id,
                startDate,
                endDate,
                userId: userIsPresent.userId,
                paymentMethod,
                amount: totalRent + 150,
                bikePrize: bikeDetails.rentAmount,
                email: userEmail
            };

            const response = await orderPlacing(orderData);
            toast.success(response.message);
            navigate(`/OrderSuccess`);
        } catch (error: any) {
            console.error('Error when wallet payments :', error);
            toast.error(error.response.data.message);
        }
    };

    const handleRazorpayPayment = async () => {
        if (userId == bikeDetails.userId) {
            Swal.fire({
                icon: "error",
                title: "Wait...",
                text: "It's Your Bike! Can't Book!",
            });
            return;
        }

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

        if (!userIsPresent) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please login first!",
            });
            navigate('/login');
            return;
        }

        const response1 = await isAdminVerifyUser(userId);
        const data = handleApiResponse(response1);

        if (!data.user?.isUser) {
            Swal.fire({
                icon: "error",
                title: "Sorry!",
                text: "Can't make booking, user is not verified!",
            });
            return;
        }

        const result = await isAlreadyBooked(bikeDetails?._id);
        if (result.data.bikeOrdered) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "This bike is already booked! Please try later.",
            });
            return;
        }

        if (!totalRent) {
            toast.error("Total rent amount is missing.");
            return;
        }

        const datas = {
            amount: totalRent,
            currency: "INR",
        };

        await createOrder(datas).then((res) => {
            if (res.data) {
                const options: RazorpayOrderOptions = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: res.data.amount,
                    currency: res.data.currency,
                    name: "2Wheeleeee",
                    description: "Order Transaction",
                    order_id: res.data.order_id,
                    handler: (response) => {
                        console.log(response);
                        const orderId = response.razorpay_order_id;
                        const amount = res.data.amount;
                        const method = "razorpay";
                        Api.post(userRoutes.placeOrder, {
                            orderId,
                            startDate,
                            endDate,
                            bikeId: bikeDetails?._id,
                            bikePrize: bikeDetails.rentAmount,
                            paymentMethod: method,
                            amount,
                            userId: userIsPresent?.userId,
                        })
                            .then((res) => {
                                if (res.data) {
                                    console.log("res", res.data);
                                    toast.success("Order placed successfully");
                                    navigate(`/OrderSuccess`);
                                }
                            });
                    },
                    prefill: {
                        name: userIsPresent?.name || "Guest User",
                        email: userIsPresent?.email || "guest@example.com",
                        contact: userIsPresent?.phoneNumber || "9999999999",
                    },
                    theme: {
                        color: "#3B82F6",
                    },
                };

                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-100 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back Button */}
                <button
                    className="mb-6 mt-10 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    onClick={() => navigate(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>

                {/* Bike Image Gallery */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-4">
                        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">{companyName} {modelName}</h1>
                        <div className="h-80 mb-4">
                            {images.length > 1 ? (
                                <Slider {...settings}>
                                    {images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <div className="flex justify-center items-center h-72">
                                                <img
                                                    src={image || "https://via.placeholder.com/150"}
                                                    alt={`${companyName} ${modelName}`}
                                                    className={`h-full object-contain transition-transform duration-300 ${zoomed === index ? "scale-[2.3]" : "scale-100"}`}
                                                    style={{
                                                        transformOrigin: transformOrigin,
                                                    }}
                                                    onMouseOver={() => handleMouseOver(index)}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={handleMouseLeave}
                                                />
                                            </div>
                                            <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-600">
                                                Hover to zoom
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <div className="relative flex justify-center items-center h-72">
                                    <img
                                        src={images[0] || "https://via.placeholder.com/150"}
                                        alt={`${companyName} ${modelName}`}
                                        className={`h-full object-contain transition-transform duration-300 ${zoomed === 0 ? "scale-[2.3]" : "scale-100"}`}
                                        style={{
                                            transformOrigin: transformOrigin,
                                        }}
                                        onMouseOver={() => handleMouseOver(0)}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                    <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-600">
                                        Hover to zoom
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content - Bike Details and Booking */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Bike Details Section */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                            <div className="bg-blue-600 py-3 px-6">
                                <h2 className="text-xl font-bold text-white">Bike Details</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border-b pb-3">
                                        <div className="w-32 font-medium text-gray-600">Model:</div>
                                        <div className="flex-1 font-semibold text-gray-800">{modelName}</div>
                                    </div>
                                    <div className="flex items-center border-b pb-3">
                                        <div className="w-32 font-medium text-gray-600">Company:</div>
                                        <div className="flex-1 font-semibold text-gray-800">{companyName}</div>
                                    </div>
                                    <div className="flex items-center border-b pb-3">
                                        <div className="w-32 font-medium text-gray-600">Reg Number:</div>
                                        <div className="flex-1 font-semibold text-gray-800">{registerNumber}</div>
                                    </div>
                                    <div className="flex items-center border-b pb-3">
                                        <div className="w-32 font-medium text-gray-600">Fuel Type:</div>
                                        <div className="flex-1 font-semibold text-gray-800">{fuelType}</div>
                                    </div>
                                    <div className="flex items-center border-b pb-3">
                                        <div className="w-32 font-medium text-gray-600">Location:</div>
                                        <div className="flex-1 font-semibold text-gray-800">{location}</div>
                                    </div>
                                    <div className="flex items-center border-b pb-3">
                                        <div className="w-32 font-medium text-gray-600">Rent:</div>
                                        <div className="flex-1 font-semibold text-gray-800">
                                            {bikeDetails.offerApplied ? (
                                                <span>
                                                    <span className="line-through text-gray-500 mr-2">₹{rentAmount}/day</span>
                                                    <span className="text-green-600">₹{bikeDetails.offerPrice}/day</span>
                                                </span>
                                            ) : (
                                                <span>₹{rentAmount}/day</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Document Validity Section */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Document Validity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <div className="w-32 font-medium text-gray-600">Insurance:</div>
                                            <div className="flex-1">
                                                <span className="font-semibold">
                                                    {new Date(insuranceExpDate).toISOString().split("T")[0]}
                                                </span>
                                                {new Date(insuranceExpDate) <= new Date() ? (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Expired
                                                    </span>
                                                ) : (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Valid
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-32 font-medium text-gray-600">Pollution:</div>
                                            <div className="flex-1">
                                                <span className="font-semibold">
                                                    {new Date(polutionExpDate).toISOString().split("T")[0]}
                                                </span>
                                                {new Date(polutionExpDate) <= new Date() ? (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Expired
                                                    </span>
                                                ) : (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Valid
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Offer Banner */}
                                {bikeDetails.offerApplied && (
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16">
                                            <div className="absolute transform rotate-45 bg-red-500 text-center text-white font-semibold py-1 right-[-35px] top-[15px] w-[130px]">
                                                OFFER
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 text-yellow-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8l-3.293-3.293A1 1 0 0112 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-red-600">Limited Time Offer!</p>
                                                <p className="text-md font-bold">Special Rent: ₹{bikeDetails.offerPrice}/day</p>
                                                <p className="text-sm text-gray-600">Book now to avail this special offer!</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Owner Details Section */}
                        {userIsPresent && userDetails && (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                                <div className="bg-blue-600 py-3 px-6">
                                    <h2 className="text-xl font-bold text-white">Owner Details</h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <img
                                            src={userDetails.profile_picture || "https://via.placeholder.com/150"}
                                            alt={`${userDetails.name}'s Profile`}
                                            className="w-20 h-20 object-cover rounded-full mr-6"
                                        />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{userDetails.name}</h3>
                                            <div className="grid grid-cols-1 gap-2 mt-2">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                    <span className="text-gray-600">{userDetails.email}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                    <span className="text-gray-600">{userDetails.phoneNumber || "Not provided"}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-600">{userDetails.address || "Not provided"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-blue-600 py-3 px-6">
                                <h2 className="text-xl font-bold text-white">Reviews</h2>
                            </div>
                            <div className="p-6">
                                <Review bikeId={bikeDetails._id} />
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
                            <div className="bg-blue-600 py-3 px-6">
                                <h2 className="text-xl font-bold text-white text-center">Book Your Ride</h2>
                            </div>
                            <div className="p-6">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                                        <p className="font-medium">{error}</p>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <p className="text-gray-700 font-medium mb-2">Rent amount per day:</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {bikeDetails.offerApplied ? (
                                            <>₹{bikeDetails.offerPrice}/day <span className="text-sm line-through text-gray-500">(₹{rentAmount})</span></>
                                        ) : (
                                            <>₹{rentAmount}/day</>
                                        )}
                                    </p>
                                </div>

                                {/* Date Selection */}
                                <div className="mb-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                calculateTotalRent(e.target.value, endDate);
                                            }}
                                            min={today}
                                            className="p-3 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                setEndDate(e.target.value);
                                                calculateTotalRent(startDate, e.target.value);
                                            }}
                                            min={startDate || today}
                                            className="p-3 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Cost Summary */}
                                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Cost Summary</h3>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Rent Total:</span>
                                        <span className="font-medium">₹{totalRent}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Service Charge:</span>
                                        <span className="font-medium text-red-600">₹150</span>
                                    </div>
                                    <div className="h-px bg-gray-300 my-2"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Grand Total:</span>
                                        <span className="text-blue-600">₹{totalRent + 150}</span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>

                                    <div className="space-y-3">
                                        {/* Razorpay Option */}
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-blue-50 border-gray-300" htmlFor="razorpay">
                                            <input
                                                type="radio"
                                                id="razorpay"
                                                name="paymentMethod"
                                                checked={paymentMethod === "razorpay"}
                                                onChange={() => setPaymentMethod("razorpay")}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                            <div className="ml-3">
                                                <span className="font-medium text-gray-900 block">Razorpay</span>
                                                <span className="text-sm text-gray-500">Credit/Debit Card, UPI, Netbanking</span>
                                            </div>
                                        </label>

                                        {/* Wallet Option */}
                                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${walletBalance !== null && walletBalance < (totalRent + 150) ? 'bg-gray-100 opacity-60' : 'hover:bg-blue-50'
                                            } border-gray-300`} htmlFor="wallet">
                                            <input
                                                type="radio"
                                                id="wallet"
                                                name="paymentMethod"
                                                checked={paymentMethod === "wallet"}
                                                onChange={() => setPaymentMethod("wallet")}
                                                disabled={walletBalance !== null && walletBalance < (totalRent + 150)}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                            <div className="ml-3">
                                                <span className="font-medium text-gray-900 block">Wallet</span>
                                                <span className="text-sm text-gray-500">
                                                    Balance: {walletBalance !== null ? `₹${walletBalance}` : 'Fetching...'}
                                                </span>
                                                {walletBalance !== null && walletBalance < (totalRent + 150) && (
                                                    <span className="text-sm text-red-500 block mt-1">Insufficient balance</span>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Book Now Button */}
                                <button
                                    className={`w-full py-3 px-6 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 ${paymentMethod === "wallet" && walletBalance !== null && walletBalance < (totalRent + 150)
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    onClick={paymentMethod === "razorpay" ? handleRazorpayPayment : handleSubmit}
                                    disabled={paymentMethod === "wallet" && walletBalance !== null && walletBalance < (totalRent + 150)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    <span>Book Now</span>
                                </button>

                                {/* Security Message */}
                                <div className="mt-4 text-center text-xs text-gray-500">
                                    <p>Secure payment processing. Your data is protected.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BikeSingleComp;