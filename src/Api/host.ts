import hostRoutes from "../service/endPoints/hostEndPoints.ts";
import Api from "../service/axios.ts";

const saveBikeDetails = async (data: FormData) => {
    try {
        const response = await Api.post(hostRoutes.saveBikeDetails, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.log('Error in host saveBikeDetails : ', error);
        throw error
    }
}

const isAdminVerifyUser = async (userId: string) => {
    try {
        const response = await Api.get(hostRoutes.isAdminVerifyUser, { params: { userId } })
        return response.data
    } catch (error) {
        console.log('Error in host isAdminVerifyUser : ', error);
        throw error
    }
}

const fetchBikeData = async (userId: string) => {
    try {
        const response = await Api.get(hostRoutes.fetchBikeData, {
            params: { userId }
        })
        return response.data
    } catch (error) {
        console.error("Error in host fetching bike data:", error);
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
        console.log("Error in host hostOrderList : ", error)
        throw error
    }
}

const hostGetOrderDetails = async (orderId: string) => {
    try {
        const response = await Api.get(`${hostRoutes.OrderDetails}/${orderId}`)
        return response.data
    } catch (error) {
        console.log("Error in host hostGetOrderDetails : ", error)
        throw error
    }
}

const createOffer = async (formData: { offerName: string; discount: string; startDate: string; endDate: string; description: string; createdBy: string }) => {
    try {
        const response = await Api.post(hostRoutes.CreateOffer, formData);
        return response.data;
    } catch (error) {
        console.log("Error in host createOffer", error);
        throw error;
    }
};

const viewOffers = async (userId: string) => {
    try {
        const response = await Api.get(`${hostRoutes.ViewOffers}?userId=${userId}`)
        return response.data
    } catch (error) {
        console.log("Error in host viewOffers : ", error);
        throw error
    }
}

const deleteOffer = async (id: string) => {
    try {
        const response = await Api.delete(`${hostRoutes.deleteOffer}/${id}`)
        return response.data
    } catch (error) {
        console.log('Error in host deleteOffer : ', error);
        throw error
    }
}

const updateOffer = async (id: string, updatedData: any) => {
    try {
        const response = await Api.put(`${hostRoutes.updateOffer}/${id}`, updatedData)
        return response.data
    } catch (error) {
        console.log('Error in host updateOffer : ', error);
        throw error
    }
}

const applyOfferToBike = async (bikeId: string, offerId: string) => {
    try {
        const response = await Api.put(hostRoutes.applyOffer, { bikeId, offerId })
        return response.data
    } catch (error) {
        console.log('Error in host applyOfferToBike : ', error);
        throw error
    }
}

const removeOfferFromBike = async (bikeId: string) => {
    try {
        const response = await Api.put(hostRoutes.removeOffer, { bikeId })
        return response.data
    } catch (error) {
        console.error("Error removing offer:", error);
        throw error
    }
};

const hostCompleteOrder = async (orderId: string) => {
    try {
        const response = await Api.put(`${hostRoutes.completeOrder}/${orderId}`)
        return response.data
    } catch (error) {
        console.log('Error in host hostCompleteOrder : ', error);
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
    applyOfferToBike,
    removeOfferFromBike,
    hostCompleteOrder
}