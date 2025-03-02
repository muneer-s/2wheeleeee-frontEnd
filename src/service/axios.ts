import axios, { AxiosInstance } from "axios";

const Api: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_B_URI || "https://2wheleeee.store"}/api`,
    withCredentials: true
})

export default Api;
