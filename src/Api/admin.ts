import Api from "../service/axios.ts";
import adminRoutes from "../service/endPoints/adminEndPoints.ts";

const login = async (credentials: { email: string; password: string }) => {
    try {
        const result = await Api.post(adminRoutes.login, credentials);
        return result.data

    } catch (error) {
        console.log(error);

    }
}

const logout = async () => {
    try {
        const result = await Api.get(adminRoutes.logout)
        return result
    } catch (error) {
        console.log(error);
    }
}

const getAllUsers = async (query: string) => {
    try {
        const result = await Api.get(`${adminRoutes.getAllUsers}${query}`);
        return result.data
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
}

const getSingleUser = async (id: string) => {
    try {
        const result = await Api.get(`${adminRoutes.getSingleUser}/${id}`);
        return result.data
    } catch (error) {
        console.log(error);

    }
}


const toggleIsUser = async (id: string) => {
    try {
        const result = await Api.put(`${adminRoutes.toggleIsUser}/${id}`)
        return result.data
    } catch (error) {
        console.log(error);

    }
}

const userBlockUnBlock = async (id: string) => {
    try {
        const result = await Api.put(`${adminRoutes.userBlockUnBlock}/${id}`)
        return result.data
    } catch (error) {
        console.log(error);

    }
}

const getAllBikeDetails = async (params: object) => {
    try {
        const response = await Api.get(adminRoutes.getAllBikeDetails, { params })
        return response.data

    } catch (error) {
        console.log(error);

    }
}


const verifyHost = async (id: string, payload: any = null) => {
    try {
        const result = await Api.put(`${adminRoutes.verifyHost}/${id}`, payload)
        return result.data
    } catch (error) {
        console.log(error);
    }
}



const isEditOn = async (bikeId: string) => {
    try {
        const response = await Api.put(`${adminRoutes.isEditOn}/${bikeId}`);
        return response.data

    } catch (error) {
        console.error('Error in isedit on:', error);
        throw error;
    }
}

const orderList = async () => {
    try {
        const response = await Api.get(adminRoutes.OrderList)
        return response.data
    } catch (error) {
        console.log("Error is fetching order list for admin", error)
        throw error
    }
}

const getOrderDetails = async (orderId: string)=>{
    try {
        const response = await Api.get(`${adminRoutes.OrderDetails}/${orderId}`)
        return response.data
    } catch (error) {
        console.log("Error is fetching order details for admin", error)
        throw error
    }
}



export {
    login,
    logout,
    getAllUsers,
    getSingleUser,
    toggleIsUser,
    getAllBikeDetails,
    verifyHost,
    userBlockUnBlock,
    isEditOn,
    orderList,
    getOrderDetails
}