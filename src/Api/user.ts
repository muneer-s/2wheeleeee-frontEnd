import userRoutes from "../service/endPoints/userEndPoints.ts";
import Api from "../service/axios.ts";

import { UserData } from "../Interfaces/Interfaces.ts";

const verifyOtp = async (data: { otp: string, userId: string | null }) => {
    try {
        const otp = parseInt(data.otp);
        const result = await Api.post(userRoutes.verifyOtp, { otp, userId: data.userId });
        return result;
    } catch (error) {
        console.log(error as Error);
        throw error;
    }
}

const resendOtp = async ({ email }: { email: string }) => {
    try {
        const response = await Api.post(userRoutes.resendOtp, { email });
        return response.data;
    } catch (error) {
        console.log(error as Error);
        throw error;
    }
}



const login = async (credentials: { email: string; password: string }) => {
    try {
        const result = await Api.post(userRoutes.login, credentials);
        console.log('result verindo : ', result)
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
        return result
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

        return result

    } catch (error) {
        console.log("error in get profile user.ts",error);
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
        return result
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
        return result

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

const getBikeDetails = async (id: string) => {
    try {
        console.log("Fetching bike details with ID:", id);

        const bike = await Api.get(`${userRoutes.getBikeDeatils}/${id}`);
        console.log("Response from backend:", bike.data);

        return bike.data

    } catch (error) {
        console.error("Error in user get bike details :", error);
        throw error;
    }
}


export {
    verifyOtp,
    resendOtp,
    login,
    logout,
    getProfile,
    edituser,
    edituserDocuments,
    forgotPassword,
    getAllBikeList,
    getBikeDetails
}