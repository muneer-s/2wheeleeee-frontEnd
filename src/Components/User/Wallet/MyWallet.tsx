import { useEffect, useState } from "react";
import { getProfile, logout, getWalletBalance } from "../../../Api/user";
import { handleApiResponse } from "../../../Utils/apiUtils";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../Apps/store";
import { UserData } from "../../../Interfaces/Interfaces";

const MyWallet = () => {
    const [walletBalance, setWalletBalance] = useState<number | null>(null);

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
                        } else {
                            toast.error(walletResponse.message);
                        }
                    }
                } 
            } catch (error:any) {
                console.error('catch Error get profile:', error);
                toast.error(error.response.data.message);
            }
        }
        fetchData();
    }, [userEmail]);

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">My Wallet</h2>
            {walletBalance !== null ? (
                <p className="text-xl font-bold text-green-600">Balance: ₹{walletBalance}</p>
            ) : (
                <p>No wallet yet.</p>
            )}
        </div>
    )
}

export default MyWallet