import hostRoutes from "../service/endPoints/hostEndPoints.ts";
import Api from "../service/axios.ts";
import { BikeData } from "../Interfaces/BikeInterface.ts";

const saveBikeDetails = async (data: FormData) => {
    try {
        const response = await Api.post(hostRoutes.saveBikeDetails, data, {
            headers: {
                "Content-Type": "multipart/form-data", 
            },
        });
        return response;
    } catch (error) {
        console.log(error as Error);
    }
}










export{
    saveBikeDetails,
}