import { createContext, useEffect, useMemo, useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import BadgeMessage from "@/components/BadgeMessage"

export const AppContext = createContext({})

const badgeShowTime = 3000

export const AppProvider = ({ children }) => {
    const [online, setOnline] = useState(0)
    const [peak, setPeak] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [badgeMessage, setBadgeMessage] = useState(null)

    const socketRef = useRef(null)
    const timeoutRef = useRef(null)

    const closeBadgeMessage = useCallback(() => {
        setBadgeMessage(null)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }, [timeoutRef.current])

    const showBadgeMessage = useCallback((badgeName) => {
        setBadgeMessage(badgeName)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setBadgeMessage(null)
        }, badgeShowTime + 500)
    }, [timeoutRef.current])

    useEffect(() => {
        const url = import.meta.env.VITE_BACKEND_URL

        const connect = () => {
            const socket = new WebSocket(url)
            socketRef.current = socket

            socket.onopen = () => {
                setIsConnected(true)
            }

            socket.onmessage = (ev) => {
                const data = JSON.parse(ev.data)
                if (data.type === "onlineCount") {
                    setOnline(data.count)
                    setPeak(data.peak)
                }

                if (data.type === "badge") {
                    showBadgeMessage(data.name)
                }
            }

            socket.onclose = () => {
                setIsConnected(false)
                setTimeout(connect, 5000)
            }

            socket.onerror = () => { }
        }

        connect()

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [showBadgeMessage])

    const values = useMemo(() => ({
        isConnected,
        online,
        peak,
        showBadgeMessage
    }), [isConnected, online, peak])

    return (
        <AppContext.Provider value={values}>
            {children}

            {badgeMessage && createPortal(
                <BadgeMessage
                    badge={badgeMessage}
                    onClose={closeBadgeMessage}
                />,
                document.getElementById('badge-root')
            )}
        </AppContext.Provider>
    )
}
