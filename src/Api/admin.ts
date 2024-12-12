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

const logout = async ()=>{
    try {
        const result = await Api.get(adminRoutes.logout)
        return result
    } catch (error) {
        console.log(error);
        
    }
}

const getAllUsers = async()=>{
    try {
        const result = await Api.get(adminRoutes.getAllUsers)
        return result
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
}

const getSingleUser = async(id:string)=>{
    try {
        const result = await Api.get(`${adminRoutes.getSingleUser}/${id}`);
        return result
    } catch (error) {
        console.log(error);
        
    }
}


const toggleIsUser = async(id:string)=>{
    try {
        const result = await Api.put(`${adminRoutes.toggleIsUser}/${id}`)
        return result  
    } catch (error) {
        console.log(error);
        
    }
}



export {
    login,
    logout,
    getAllUsers,
    getSingleUser,
    toggleIsUser
}