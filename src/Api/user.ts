import errorHandler from "./errorHandler.ts";
import userRoutes from "../service/endPoints/userEndPoints";
import Api from "../service/axios.ts";



const verifyOtp = async (otpnum: string) => {
    try {
        const otp = parseInt(otpnum);
        const result = await Api.post(userRoutes.verifyOtp, { otp });
        return result;
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}

const resendOtp = async () => {
    try {
        await Api.get(userRoutes.resendOtp);
    } catch (error) {
        console.log(error as Error);
    }
}


export {
    verifyOtp,
    resendOtp
}