import { useEffect, useRef, useCallback } from "react"
import OnlineApi, { URL as ONLINE_URL } from "@/api/online"

const HEARTBEAT_INTERVAL = 15_000
const DECREMENT_PAYLOAD = JSON.stringify({})
const INCREMENT_DELAY = 300

const isPageReload = () => {
    try {
        const wasVisited = sessionStorage.getItem("online_tracked")
        sessionStorage.setItem("online_tracked", "1")
        return wasVisited === "1"
    } catch {
        return false
    }
}

const sendDecrement = () => {
    try {
        navigator.sendBeacon(ONLINE_URL + "/decrement", DECREMENT_PAYLOAD)
    } catch {
        fetch(ONLINE_URL + "/decrement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true
        }).catch(() => {})
    }
}

const scheduleIncrement = () => {
    return new Promise((resolve) => {
        if (isPageReload()) {
            setTimeout(resolve, INCREMENT_DELAY)
        } else {
            resolve()
        }
    })
}

const useOnline = () => {
    const heartbeatTimer = useRef(null)
    const isIncremented = useRef(false)

    const handleDecrement = useCallback(() => {
        if (!isIncremented.current) return
        isIncremented.current = false
        sendDecrement()
    }, [])

    useEffect(() => {
        const stopHeartbeat = () => {
            if (heartbeatTimer.current) {
                clearInterval(heartbeatTimer.current)
                heartbeatTimer.current = null
            }
        }

        const startHeartbeat = () => {
            stopHeartbeat()
            heartbeatTimer.current = setInterval(() => {
                OnlineApi.increment()
                    .then(() => { isIncremented.current = true })
                    .catch((error) => { console.error("Heartbeat failed:", error) })
            }, HEARTBEAT_INTERVAL)
        }

        scheduleIncrement().then(() => {
            OnlineApi.increment()
                .then(() => { isIncremented.current = true })
                .catch((error) => { console.error("Failed to increment online:", error) })
            startHeartbeat()
        })

        const handleOffline = () => {
            handleDecrement()
            stopHeartbeat()
        }

        const handleOnline = () => {
            OnlineApi.increment()
                .then(() => { isIncremented.current = true })
                .catch((error) => { console.error("Reconnect failed:", error) })
            startHeartbeat()
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                handleDecrement()
                stopHeartbeat()
            }
        }

        window.addEventListener("beforeunload", handleDecrement)
        window.addEventListener("offline", handleOffline)
        window.addEventListener("online", handleOnline)
        window.addEventListener("pagehide", handleDecrement)
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.removeEventListener("beforeunload", handleDecrement)
            window.removeEventListener("offline", handleOffline)
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("pagehide", handleDecrement)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            stopHeartbeat()
            sendDecrement()
        }
    }, [handleDecrement])
}

export default useOnline
