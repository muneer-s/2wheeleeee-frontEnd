import userRoutes from "../service/endPoints/userEndPoints.ts";
import Api from "../service/axios.ts";
import { UserData } from "../Interfaces/Interfaces.ts";
import { IUserFeedbacks } from "../Components/User/Feedback/FeedbackForm.tsx";

const verifyOtp = async (data: { otp: string, userId: string | null }) => {
    try {
        const otp = parseInt(data.otp);
        const result = await Api.post(userRoutes.verifyOtp, { otp, userId: data.userId });
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const resendOtp = async ({ email }: { email: string }) => {
    try {
        const response = await Api.post(userRoutes.resendOtp, { email });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const signup = async (userData: { name: string, email: string, password: string }) => {
    try {
        const result = await Api.post(userRoutes.signup, userData)
        return result.data;
    } catch (error) {
        throw error
    }
}

const login = async (credentials: { email: string; password: string }) => {
    try {
        const result = await Api.post(userRoutes.login, credentials);
        return result.data
    } catch (error: any) {
        console.log(error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { message: 'Network error or server unavailable' };
        }
    }
}

const logout = async (Credential: { email: string }) => {
    try {
        const result = await Api.put(userRoutes.logout, Credential)
        return result.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const forgotPassword = async (email: string) => {
    try {
        const result = await Api.post(userRoutes.forgotPassword, { email })
        return result
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getProfile = async (email: string) => {
    try {
        const result = await Api.get(`${userRoutes.getProfile}?email=${email}`);
        return result.data
    } catch (error) {
        console.log("error in get profile user.ts", error);
        throw error
    }
}

const edituser = async (email: string, updatedDetails: Partial<UserData>) => {
    try {
        const result = await Api.put(userRoutes.editUser, { email, ...updatedDetails }, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return result.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const edituserDocuments = async (formData: FormData) => {
    try {
        const result = await Api.put(userRoutes.editUserDocuments, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return result.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllBikeList = async (params: any) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const BikeList = await Api.get(`${userRoutes.getAllBikes}?${queryString}`)
        return BikeList.data
    } catch (error) {
        console.error("Error in user get all bike list :", error);
        throw error;
    }
}

const checkBlockedStatus = async (email: string) => {
    try {
        const response = await Api.post(userRoutes.checkBlockedStatus, { email });
        return response.data;
    } catch (error) {
        console.error('Error checking blocked status:', error);
        throw error;
    }
}

const getBikeDetails = async (id: string) => {
    try {
        const bike = await Api.get(`${userRoutes.getBikeDeatils}/${id}`);
        return bike.data
    } catch (error) {
        console.error("Error in user get bike details : ", error);
        throw error;
    }
}

const orderPlacing = async (orderData: { bikeId: string; startDate: string; endDate: string; userId: string; paymentMethod: string; bikePrize: Number; email?: string }) => {
    try {
        const response = await Api.post(userRoutes.placeOrder, orderData);
        return response.data;
    } catch (error) {
        console.log('Error in order placing : ', error)
        throw error
    }
}

const createOrder = async (datas: any) => {
    try {
        const response = await Api.post(userRoutes.createOrder, datas);
        return response;
    } catch (error) {
        console.log('Error in order creating : ', error)
        throw error
    }
}

const getWalletBalance = async (walletId: string) => {
    try {
        const response = await Api.get(`${userRoutes.getWallet}/${walletId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        return { success: false, message: "Failed to fetch wallet balance" };
    }
};

const userOrderList = async (userId: string) => {
    try {
        const response = await Api.get(`${userRoutes.OrderList}?userId=${userId}`);
        return response.data
    } catch (error) {
        console.log("Error is fetching order list for user", error)
        throw error
    }
}

const userGetOrderDetails = async (orderId: string) => {
    try {
        const response = await Api.get(`${userRoutes.OrderDetails}/${orderId}`)
        return response.data
    } catch (error) {
        console.log("Error is fetching order details", error)
        throw error
    }
}

const earlyReturns = async (orderId: string) => {
    try {
        const response = await Api.put(`${userRoutes.earlyReturns}/${orderId}`)
        return response.data
    } catch (error) {
        console.log("Error when user try to return the bike early ", error)
        throw error
    }
}

const returnOrder = async (orderId: string) => {
    try {
        const response = await Api.put(`${userRoutes.returnOrder}/${orderId}`)
        return response.data
    } catch (error) {
        console.log("Error when user try to return the bike ", error)
        throw error
    }
}

const getReviews = async (bikeId: string) => {
    try {
        const response = await Api.get(`${userRoutes.getReviews}/${bikeId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const submitReview = async (reviewData: any) => {
    try {
        const response = await Api.post(userRoutes.submitReview, reviewData)
        return response.data
    } catch (error) {
        throw error
    }
}

const createFeedback = async (datas: IUserFeedbacks) => {
    try {
        const response = await Api.post(userRoutes.createFeedback, datas);
        return response.data;
    } catch (error) {
        console.log('Error during creating feedback  : ', error)
        throw error
    }
}

const getUserFeedback = async (userId: string) => {
    try {
        const response = await Api.get(`${userRoutes.feedback}/${userId}`)
        return response.data
    } catch (error) {
        console.log('Error during getting feedback  : ', error)
        throw error
    }
}

const updateFeedback = async (feedbackId: string, feedbackData: { rating: number; comment: string }) => {
    try {
        const response = await Api.put(`${userRoutes.feedback}/${feedbackId}`, feedbackData);
        return response.data;
    } catch (error) {
        console.log('Error during updating feedback  : ', error)
        throw error
    }
};

const deleteFeedback = async (feedbackId: string) => {
    try {
        const response = await Api.delete(`${userRoutes.feedback}/${feedbackId}`);
        return response.data;
    } catch (error) {
        console.log('Error during deleting feedback  : ', error)
        throw error
    }
};

const allFeedbacks = async () => {
    try {
        const response = await Api.get(userRoutes.allFeedbacks)
        return response.data
    } catch (error) {
        console.log("Error is fetching feedbacks list for user", error)
        throw error
    }
}

const isAlreadyBooked = async (bikeId: string) => {
    try {
        const response = await Api.get(`${userRoutes.isAlreadyBooked}/${bikeId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export {
    verifyOtp,
    resendOtp,
    signup,
    login,
    logout,
    getProfile,
    edituser,
    edituserDocuments,
    forgotPassword,
    getAllBikeList,
    getBikeDetails,
    checkBlockedStatus,
    orderPlacing,
    createOrder,
    getWalletBalance,
    userOrderList,
    userGetOrderDetails,
    earlyReturns,
    returnOrder,
    getReviews,
    submitReview,
    createFeedback,
    getUserFeedback,
    updateFeedback,
    deleteFeedback,
    allFeedbacks,
    isAlreadyBooked
}