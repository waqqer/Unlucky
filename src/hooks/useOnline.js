import { useEffect, useRef, useCallback } from "react"
import OnlineApi, { URL as ONLINE_URL } from "@/api/online"

const HEARTBEAT_INTERVAL = 15_000

const sendDecrement = () => {
    fetch(ONLINE_URL + "/decrement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true
    }).catch(() => {})
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

        OnlineApi.increment()
            .then(() => { isIncremented.current = true })
            .catch((error) => { console.error("Failed to increment online:", error) })

        startHeartbeat()

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

        window.addEventListener("beforeunload", handleDecrement)
        window.addEventListener("offline", handleOffline)
        window.addEventListener("online", handleOnline)

        return () => {
            window.removeEventListener("beforeunload", handleDecrement)
            window.removeEventListener("offline", handleOffline)
            window.removeEventListener("online", handleOnline)
            stopHeartbeat()
            sendDecrement()
        }
    }, [handleDecrement])
}

export default useOnline
