import { useEffect, useRef, useCallback } from "react"
import OnlineApi, { URL as ONLINE_URL } from "@/api/online"

const DECREMENT_PAYLOAD = JSON.stringify({})

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

const useOnline = () => {
    const isIncremented = useRef(false)

    const handleDecrement = useCallback(() => {
        if (!isIncremented.current) return
        isIncremented.current = false
        sendDecrement()
    }, [])

    const handleIncrement = useCallback(() => {
        if (isIncremented.current) return
        OnlineApi.increment()
            .then(() => { isIncremented.current = true })
            .catch((error) => { console.error("Failed to increment online:", error) })
    }, [])

    useEffect(() => {
        handleIncrement()

        const handleOffline = () => handleDecrement()
        const handleOnline = () => handleIncrement()

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                handleDecrement()
            } else if (document.visibilityState === "visible") {
                handleIncrement()
            }
        }

        window.addEventListener("beforeunload", handleDecrement)
        window.addEventListener("offline", handleOffline)
        window.addEventListener("online", handleOnline)
        window.addEventListener("pagehide", handleDecrement)
        window.addEventListener("unload", handleDecrement)
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.removeEventListener("beforeunload", handleDecrement)
            window.removeEventListener("offline", handleOffline)
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("pagehide", handleDecrement)
            window.removeEventListener("unload", handleDecrement)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            sendDecrement()
        }
    }, [handleIncrement, handleDecrement])
}

export default useOnline
