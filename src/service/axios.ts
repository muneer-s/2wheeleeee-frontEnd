import axios, { AxiosInstance } from "axios";


const Api: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_B_URI}/api`,
    withCredentials: true
})

export default Api;



