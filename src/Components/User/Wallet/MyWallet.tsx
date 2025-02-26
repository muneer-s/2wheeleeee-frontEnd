import { useEffect, useState } from "react";
import { getProfile, getWalletBalance } from "../../../Api/user";
import { handleApiResponse } from "../../../Utils/apiUtils";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../Apps/store";

interface WalletHistory {
    date: string;
    type: string;
    amount: number;
    reason: string;
}

const MyWallet = () => {
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([]);

    const authState = useAppSelector((state) => state.auth);
    const userEmail = authState.user.email

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProfile(userEmail);
                const userDetails = handleApiResponse(response)

                if (response.success) {

                    if (userDetails.wallet) {
                        const walletResponse = await getWalletBalance(userDetails.wallet);

                        if (walletResponse.success) {
                            setWalletBalance(walletResponse.data.balance);
                            setWalletHistory(walletResponse.data.history);
                        } else {
                            toast.error(walletResponse.message);
                        }
                    }
                }
            } catch (error: any) {
                console.error('catch Error get profile:', error);
                toast.error(error.response.data.message);
            }
        }
        fetchData();
    }, [userEmail]);

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">My Wallet</h2>
            {walletBalance !== null ? (
                <p className="text-xl font-bold text-green-600">Balance: ₹{walletBalance}</p>
            ) : (
                <p>No wallet yet.</p>
            )}

            {/* Wallet History Table */}
            {walletHistory.length > 0 ? (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Date</th>
                                <th className="border p-2 text-left">Type</th>
                                <th className="border p-2 text-left">Amount</th>
                                <th className="border p-2 text-left">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {walletHistory.map((entry, index) => (
                                <tr key={index} className="border-b">
                                    <td className="border p-2">{new Date(entry.date).toLocaleDateString()}</td>
                                    <td className={`border p-2 ${entry.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {entry.type}
                                    </td>
                                    <td className="border p-2">₹{entry.amount}</td>
                                    <td className="border p-2">{entry.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="mt-4 text-gray-500">No transactions found.</p>
            )}
        </div>
    )
}

export default MyWallet