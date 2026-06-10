import type { UserPayload } from "@/Shared/Types/UserTypes"
import axios, { type InternalAxiosRequestConfig, AxiosError } from "axios"
import { jwtDecode } from "jwt-decode"

let _accessToken = ""
let _user: UserPayload | null = null

export const getUser = () => _user;

export const setAccessToken = (token: string) => {
    _accessToken = token
    _user = token ? jwtDecode<UserPayload>(token) : null
}

export const $api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND!
})

let isRefreshing = false
let failedQueue: any[] = []

const proccesQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

$api.interceptors.request.use((config) => {
    if (_accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${_accessToken}`
    }
    return config
})

$api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalReq = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalReq._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    if (originalReq.headers) {
                        originalReq.headers.Authorization = `Bearer ${token}`
                    }
                    return $api(originalReq)
                }).catch((err) => Promise.reject(err))
            }

            originalReq._retry = true
            isRefreshing = true

            const savedRefreshToken = localStorage.getItem("refresh_token")

            if (!savedRefreshToken) {
                return Promise.reject(error)
            }

            return new Promise((resolve, reject) => {
                axios
                    .post(import.meta.env.VITE_BACKEND! + "/private/api/auth/refresh", { refresh: savedRefreshToken })
                    .then((res) => {
                        const { access, refresh } = res.data

                        _accessToken = access
                        _user = jwtDecode<UserPayload>(access) 
                        
                        localStorage.setItem('refresh_token', refresh)

                        if (originalReq.headers) {
                            originalReq.headers.Authorization = `Bearer ${access}`
                        }

                        proccesQueue(null, access)
                        resolve($api(originalReq))
                    })
                    .catch((refreshError) => {
                        proccesQueue(refreshError, null)
                        localStorage.removeItem("refresh_token")
                        _accessToken = ""
                        _user = null
                        reject(refreshError)
                    })
                    .finally(() => {
                        isRefreshing = false
                    })
            })
        }

        return Promise.reject(error)
    }
)