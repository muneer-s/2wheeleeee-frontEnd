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



export {
    login,
    logout
}