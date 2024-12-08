import errorHandler from "./errorHandler.ts";
import userRoutes from "../service/endPoints/userEndPoints";
import Api from "../service/axios.ts";

export interface UserData {
    _id: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: number;
    isBlocked: boolean;
    isVerified: boolean;
    profile_picture: string;
    dateOfBirth: Date;
    address: string | null;
    isUser: boolean;
    lisence_number: number;
    lisence_Exp_Date: Date;
    lisence_picture_front: string;
    lisence_picture_back: string;
}

const verifyOtp = async (data: { otp: string, userId: string | null }) => {
    try {
        const otp = parseInt(data.otp);
        const result = await Api.post(userRoutes.verifyOtp, { otp, userId: data.userId });
        return result;
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}

const resendOtp = async ({ email }: { email: string }) => {
    try {
        const response = await Api.post(userRoutes.resendOtp, { email });
        return response.data;
    } catch (error) {
        console.log(error as Error);
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

    }
}

const getProfile = async (email: string) => {
    try {

        const result = await Api.get(`${userRoutes.getProfile}?email=${email}`);

        return result

    } catch (error) {
        console.log(error);

    }
}

const edituser = async(email:string,updatedDetails: Partial<UserData>)=>{
    try {
        const result = Api.put(userRoutes.editUser,{ email, ...updatedDetails })
        return result
    } catch (error) {
        console.log(error);
        
    }
}


export {
    verifyOtp,
    resendOtp,
    login,
    logout,
    getProfile,
    edituser
}