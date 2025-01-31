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

                console.log(111111,response)
                console.log(222222,userDetails)

                if (response.success) {

                    if (userDetails.wallet) {
                        console.log(99999,userDetails.wallet)
                        const walletResponse = await getWalletBalance(userDetails.wallet);
                        console.log(555,walletResponse)

                        if (walletResponse.success) {
                            setWalletBalance(walletResponse.data.balance);
                        } else {
                            toast.error(walletResponse.message);
                        }
                    }
                } else {
                    toast.error(response.message)
                    await logout({ email: userEmail });
                }
            } catch (error) {
                console.error('catch Error get profile:', error);
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