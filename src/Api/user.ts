import errorHandler from "./errorHandler.ts";
import userRoutes from "../service/endPoints/userEndPoints";
import Api from "../service/axios.ts";



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
        return result.data
    } catch (error) {
        console.log(error);

    }
}

const logout = async (Credential:{email:string})=>{
    try {
        const result = await Api.put(userRoutes.logout,Credential)
        return result
    } catch (error) {
        console.log(error);
        
    }
}

const getProfile = async (email: string)=>{
    try {
        
        const result = await Api.get(`${userRoutes.getProfile}?email=${email}`);

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
    getProfile
}