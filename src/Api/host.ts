import hostRoutes from "../service/endPoints/hostEndPoints.ts";
import Api from "../service/axios.ts";
//import { BikeData } from "../Interfaces/BikeInterface.ts";

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

const isAdminVerifyUser = async (userId: string) => {
    try {

        const response = await Api.get(hostRoutes.isAdminVerifyUser, { params: { userId } })
        return response

    } catch (error) {
        console.log(error);
    }
}

const fetchBikeData = async (userId: string) => {
    try {
        const response = await Api.get(hostRoutes.fetchBikeData, {
            params: { userId }
        })
        return response.data

    } catch (error) {
        console.error("Error fetching bike data:", error);
        throw error;
    }
}

const singleBikeView = async (bikeId: string) => {
    try {
        const response = await Api.get(hostRoutes.bikeSingleView, {
            params: { bikeId }
        })
        return response.data

    } catch (error) {
        console.error("Error fetching bike :", error);
        throw error;
    }
}

const deleteSelectedBike = async (bikeId: string) => {
    try {

        const response = await Api.delete(hostRoutes.deleteBike, {
            params: { bikeId }
        })

        return response.data

    } catch (error) {
        console.error("Error deleting bike :", error);
        throw error;
    }
}

const updateBikeDetails = async (bikeId: string | undefined, formData: FormData) => {
    try {
        const response = await Api.post(hostRoutes.editBike, formData, {
            params: { bikeId },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })



        return response.data
    } catch (error) {
        console.error("Error edit bike :", error);
        throw error;
    }
}




export {
    saveBikeDetails,
    isAdminVerifyUser,
    fetchBikeData,
    singleBikeView,
    deleteSelectedBike,
    updateBikeDetails
}