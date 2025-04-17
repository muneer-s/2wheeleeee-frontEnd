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
  const [isLoading, setIsLoading] = useState(true);
  const authState = useAppSelector((state) => state.auth);
  const userEmail = authState.user.email;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getProfile(userEmail);
        const userDetails = handleApiResponse(response);
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
        console.error("catch Error get profile:", error);
        toast.error(error.response?.data?.message || "Failed to fetch wallet data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userEmail]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with balance */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <h2 className="text-xl font-bold text-white mb-2">My Wallet</h2>
        {isLoading ? (
          <div className="animate-pulse h-8 w-40 bg-white bg-opacity-30 rounded"></div>
        ) : walletBalance !== null ? (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">₹{walletBalance.toLocaleString("en-IN")}</span>
            <span className="text-white text-opacity-80 ml-2">Available Balance</span>
          </div>
        ) : (
          <p className="text-white">No wallet available</p>
        )}
      </div>

      {/* Transaction History */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between p-3 border border-gray-100 rounded-md">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : walletHistory.length > 0 ? (
          <div className="space-y-2">
            {walletHistory.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50 border-b border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-800">{entry.reason}</p>
                  <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                </div>
                <div className={`text-lg font-semibold ${entry.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {entry.type === "credit" ? "+" : "-"}₹{entry.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 text-center rounded-md">
            <p className="text-gray-500 mb-2">No transaction history available</p>
            <p className="text-sm text-gray-400">Your transaction history will appear here once you start using your wallet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWallet;