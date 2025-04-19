import { useEffect, useState } from 'react';
import { applyOfferToBike, viewOffers } from '../../../Api/host';
import { useAppSelector } from '../../../Apps/store';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../../User/Header/Header';
import Footer from '../../User/Footer/Footer';

const ApplyOffer = () => {
    const [offers, setOffers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const authState = useAppSelector((state) => state.auth);
    const userId = authState.user?.userId;

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchOffers();
        }
    }, [userId]);

    const fetchOffers = async () => {
        setIsLoading(true);
        try {
            const response = await viewOffers(userId);
            setOffers(response.data.offer);
        } catch (error) {
            console.error("Error fetching offers:", error);
            toast.error("Failed to load offers");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyOffer = async (offerId: string) => {
        if (!id) {
            console.error("Bike ID is missing.");
            toast.error("Bike ID is missing");
            return;
        }
        try {
            await applyOfferToBike(id, offerId);
            toast.success("Offer applied successfully!");
            navigate('/hostBikeListPage');
        } catch (error: any) {
            console.error("Error applying offer:", error);
            toast.error(error.response.data.message);
        }
    };

    const getStatusBadge = (startDate: Date, endDate: Date) => {
        const now = new Date();

        if (now > endDate) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>;
        } else if (now >= startDate) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Upcoming</span>;
        }
    };

    return (
        <>
            <Header />
            <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Available Offers</h2>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : offers.length > 0 ? (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <ul className="divide-y divide-gray-200">
                                {offers.map((offer) => {
                                    const startDate = new Date(offer.startDate);
                                    const endDate = new Date(offer.endDate);
                                    const isExpired = endDate < new Date();

                                    return (
                                        <li key={offer._id} className="px-4 py-5 sm:p-6 hover:bg-gray-50 transition-colors">
                                            <div className="md:flex md:justify-between md:items-center">
                                                <div className="md:flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">{offer.offerName}</h3>
                                                        <div className="ml-3">
                                                            {getStatusBadge(startDate, endDate)}
                                                        </div>
                                                    </div>

                                                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                            </svg>
                                                            <span className="font-medium text-indigo-600">{offer.discount}% Off</span>
                                                        </div>
                                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <p className="mt-2 text-sm text-gray-600">{offer.description}</p>
                                                </div>

                                                <div className="mt-4 md:mt-0 md:ml-6">
                                                    <button
                                                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${isExpired
                                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            }`}
                                                        onClick={() => !isExpired && handleApplyOffer(offer._id)}
                                                        disabled={isExpired}
                                                    >
                                                        {isExpired ? (
                                                            <>
                                                                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Expired
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Apply Offer
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-12 sm:px-6 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No offers available</h3>
                                <p className="mt-1 text-sm text-gray-500">Create some offers first to apply them to your bikes.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>

    );
};

export default ApplyOffer;