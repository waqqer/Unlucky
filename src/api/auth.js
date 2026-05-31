import { fetchUrl } from "./config"

const TOKEN_KEY = "token"
const EXPIRY_BUFFER_MS = 60_000
const REFRESH_BEFORE_MS = 5 * 60_000

let memoryToken = null
let currentSpUser = null
let refreshPromise = null
let refreshTimer = null

function normalizeUuid(value) {
    if (typeof value !== "string")
        return ""
    return value.replace(/-/g, "").toLowerCase()
}

function isValidTokenString(token) {
    return typeof token === "string" && token.length > 0 && token !== "undefined" && token !== "null"
}

export function getToken() {
    if (isValidTokenString(memoryToken))
        return memoryToken

    const stored = localStorage.getItem(TOKEN_KEY)
    if (isValidTokenString(stored)) {
        memoryToken = stored
        return stored
    }

    if (stored !== null)
        localStorage.removeItem(TOKEN_KEY)

    return null
}

export function setToken(token) {
    if (!isValidTokenString(token))
        return false

    memoryToken = token
    localStorage.setItem(TOKEN_KEY, token)
    scheduleTokenRefresh()
    return true
}

export function setSpUser(user) {
    if (user?.minecraftUUID)
        currentSpUser = user
}

export function clearTokenRefreshTimer() {
    if (refreshTimer) {
        clearTimeout(refreshTimer)
        refreshTimer = null
    }
}

function parseJwtPayload(token) {
    try {
        const base64 = token.split(".")[1]
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"))
        return JSON.parse(json)
    } catch {
        return null
    }
}

export function getTokenUuid() {
    const payload = parseJwtPayload(getToken())
    return typeof payload?.uuid === "string" ? payload.uuid : null
}

export function isTokenExpired(token = getToken(), bufferMs = EXPIRY_BUFFER_MS) {
    if (!token)
        return true

    const payload = parseJwtPayload(token)
    if (!payload?.exp)
        return true

    return Date.now() >= payload.exp * 1000 - bufferMs
}

async function requestNewToken(spUser = currentSpUser) {
    if (!spUser?.minecraftUUID)
        return null

    const response = await fetch(fetchUrl + "/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: spUser.username,
            UUID: spUser.minecraftUUID
        })
    })

    if (!response.ok)
        return null

    const data = await response.json()
    if (setToken(data?.token))
        return data.token

    return null
}

export async function refreshToken(spUser) {
    if (spUser)
        setSpUser(spUser)

    if (refreshPromise)
        return refreshPromise

    refreshPromise = requestNewToken(currentSpUser).finally(() => {
        refreshPromise = null
    })

    return refreshPromise
}

export async function ensureValidToken(spUser) {
    if (spUser)
        setSpUser(spUser)

    const token = getToken()
    const tokenUuid = getTokenUuid()
    const spUuid = spUser?.minecraftUUID
    const uuidMatches = !spUuid || !tokenUuid
        || normalizeUuid(tokenUuid) === normalizeUuid(spUuid)

    if (token && !isTokenExpired(token) && uuidMatches)
        return token

    return refreshToken(spUser)
}

function scheduleTokenRefresh() {
    clearTokenRefreshTimer()

    const token = getToken()
    if (!token)
        return

    const payload = parseJwtPayload(token)
    if (!payload?.exp)
        return

    const delay = payload.exp * 1000 - REFRESH_BEFORE_MS - Date.now()
    refreshTimer = setTimeout(() => {
        refreshToken()
    }, Math.max(delay, 0))
}

export async function authFetch(input, init = {}) {
    await ensureValidToken()

    const buildInit = () => {
        const headers = new Headers(init.headers || {})
        const token = getToken()
        if (token)
            headers.set("Authorization", `Bearer ${token}`)
        return { ...init, headers }
    }

    let response = await fetch(input, buildInit())

    if ((response.status === 401 || response.status === 403) && currentSpUser) {
        await refreshToken()
        if (getToken())
            response = await fetch(input, buildInit())
    }

    return response
}

getToken()
if (getToken())
    scheduleTokenRefresh()
