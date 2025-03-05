import axios, { AxiosInstance } from "axios";

const Api: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true
})

export default Api;
