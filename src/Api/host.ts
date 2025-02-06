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
        return response.data;
    } catch (error) {
        console.log(error as Error);
    }
}

const isAdminVerifyUser = async (userId: string) => {
    try {

        const response = await Api.get(hostRoutes.isAdminVerifyUser, { params: { userId } })
        return response.data

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

const editBike = async (bikeId: string | undefined, formData: FormData) => {
    try {
        const response = await Api.put(hostRoutes.editBike, formData, {
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

const hostOrderList = async (id: string) => {
    try {
        const response = await Api.get(`${hostRoutes.OrderList}?Id=${id}`);
        return response.data
    } catch (error) {
        console.log("Error is fetching order list for admin", error)
        throw error
    }
}


const hostGetOrderDetails = async (orderId: string) => {
    try {
        const response = await Api.get(`${hostRoutes.OrderDetails}/${orderId}`)
        return response.data
    } catch (error) {
        console.log("Error is fetching order details for admin", error)
        throw error
    }
}

const createOffer = async (formData: { offerName: string; discount: string; startDate: string; endDate: string; description: string; createdBy: string }) => {
    try {
        const response = await Api.post(hostRoutes.CreateOffer, formData);
        return response.data;
    } catch (error) {
        console.log("Error when creating offer");
        throw error;
    }
};

const viewOffers = async (userId: string) => {
    try {
        const response = await Api.get(`${hostRoutes.ViewOffers}?userId=${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}


const deleteOffer = async (id: string) => {
    try {
        const response = await Api.delete(`${hostRoutes.deleteOffer}/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const updateOffer = async (id: string, updatedData: any) => {
    try {
        const response = await Api.put(`${hostRoutes.updateOffer}/${id}`, updatedData)
        return response.data
    } catch (error) {
        throw error
    }
}


const applyOfferToBike = async (bikeId: string, offerId: string) => {
    try {
        const response = await Api.put(hostRoutes.applyOffer, { bikeId, offerId })
        return response.data


    } catch (error) {
        throw error
    }
}






export {
    saveBikeDetails,
    isAdminVerifyUser,
    fetchBikeData,
    singleBikeView,
    deleteSelectedBike,
    editBike,
    hostOrderList,
    hostGetOrderDetails,
    createOffer,
    viewOffers,
    deleteOffer,
    updateOffer,
    applyOfferToBike
}