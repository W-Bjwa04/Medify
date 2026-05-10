import axios from "axios"

import { getSession } from "next-auth/react"

// Axios instance — Base URL from env, defaults to http://localhost:5000/api

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000
})

// Request interceptor — Automatically attaches JWT token from Auth.js session

axiosInstance.interceptors.request.use(
    async (config) => {
        // API: GET session token from next-auth
        // BACKEND: The token is issued by POST /api/auth/login

        const session = await getSession()
        if (session?.user) {
            const token = (session as any).accessToken
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor — If 401 received, redirect to login page
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login"
            }
        }
        return Promise.reject(error)
    }
)


export default axiosInstance