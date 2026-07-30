import type { SPUser, UserPayload } from "@/Shared/Types/UserTypes"
import axios from "axios"
import API_URL from "./Config"

let _spUserToken = ""
let _user: UserPayload | null = null
let _onUserChangeCallback: ((user: UserPayload | null) => void) | null = null

export const getUser = () => _user
export const getSPUserToken = () => _spUserToken

const toBase64Json = (value: unknown): string => {
    const bytes = new TextEncoder().encode(JSON.stringify(value))
    let binary = ""

    for (const byte of bytes) {
        binary += String.fromCharCode(byte)
    }

    return btoa(binary)
}

export const setSPUser = (user: SPUser | null) => {
    _spUserToken = user ? toBase64Json(user) : ""
    _user = user ? {
        id: 0,
        UUID: user.minecraftUUID,
        name: user.username
    } : null

    if(_onUserChangeCallback) {
        _onUserChangeCallback(_user)
    }
}

export const subscribeUserChange = (callback: (user: UserPayload | null) => void) => {
    _onUserChangeCallback = callback
}

export const $api = axios.create({
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    if (_spUserToken && config.headers) {
        config.headers.Authorization = `Bearer ${_spUserToken}`
    }
    return config
})
