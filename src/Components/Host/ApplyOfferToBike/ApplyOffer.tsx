import { useEffect, useState } from 'react';
import { applyOfferToBike, viewOffers } from '../../../Api/host';
import { useAppSelector } from '../../../Apps/store';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ApplyOffer = () => {
    const [offers, setOffers] = useState<any[]>([]);
    const authState = useAppSelector((state) => state.auth);
    const userId = authState.user?.userId;

    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (userId) {
            fetchOffers();
        }
    }, [userId]);

    const fetchOffers = async () => {
        try {
            const response = await viewOffers(userId);
            setOffers(response.data.offer);
        } catch (error) {
            console.error("Error fetching offers:", error);
        }
    };

    const handleApplyOffer = async (offerId: string) => {

        if (!id) {
            console.error("Bike ID is missing.");
            toast.error("Bike ID is missing")
            return;
        }
        try {
            await applyOfferToBike(id, offerId);
            toast.success("Offer applied successfully!");
            navigate('/hostBikeListPage')
        } catch (error: any) {
            console.error("Error applying offer:", error);
            toast.error(error.response.data.message);
        }

    };

    return (
        <div className="p-6">

            <h2 className="text-xl font-semibold mb-4">Available Offers</h2>

            {offers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 border">Offer Name</th>
                                <th className="py-2 px-4 border">Discount (%)</th>
                                <th className="py-2 px-4 border">Start Date</th>
                                <th className="py-2 px-4 border">End Date</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((offer) => {
                                const isExpired = new Date(offer.endDate) < new Date();

                                return (
                                    <tr key={offer._id} className="text-center border-b">
                                        <td className="py-2 px-4 border">{offer.offerName}</td>
                                        <td className="py-2 px-4 border">{offer.discount}%</td>
                                        <td className="py-2 px-4 border">
                                            {new Date(offer.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {new Date(offer.endDate).toLocaleDateString()}{" "}
                                            {isExpired && (
                                                <span className="text-red-500 font-semibold">(Expired)</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">{offer.description}</td>

                                        <td className="py-2 px-4 border">
                                            <button
                                                className={`px-4 py-1 rounded ${isExpired
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                                    }`}
                                                onClick={() => !isExpired && handleApplyOffer(offer._id)}
                                                disabled={isExpired}
                                            >
                                                {isExpired ? "Expired" : "Apply Offer"}
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ml-4"
                                                onClick={() => navigate(-1)}>
                                                Back
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No offers available.</p>
            )}
        </div>
    );
};

export default ApplyOffer;
