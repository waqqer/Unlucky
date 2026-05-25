import { createContext, useEffect, useMemo, useState, useRef, useCallback, useContext } from "react"
import { createPortal } from "react-dom"
import BadgeMessage from "@/components/BadgeMessage"
import { AccountContext } from "./AccountContext";

export const AppContext = createContext({})

const badgeShowTime = 3000

export const AppProvider = ({ children }) => {
    const [online, setOnline] = useState(0)
    const [peak, setPeak] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [badgeMessage, setBadgeMessage] = useState(null)
    const { user } = useContext(AccountContext)

    const socketRef = useRef(null)
    const timeoutRef = useRef(null)

    const closeBadgeMessage = useCallback(() => {
        setBadgeMessage(null)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    const showBadgeMessage = useCallback((badgeName) => {
        setBadgeMessage(badgeName)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        timeoutRef.current = setTimeout(() => {
            setBadgeMessage(null)
        }, badgeShowTime + 500)
    }, [])

    useEffect(() => {
        if (!user)
            return

        let url = import.meta.env.VITE_BACKEND_URL
        url = `${url}/${user.minecraftUUID}`

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
                    if (data.show) {
                        if (data.timeout) {
                            setTimeout(() => {
                                showBadgeMessage(data.name)
                            }, data.timeout)
                        }
                        else {
                            showBadgeMessage(data.name)
                        }
                    }
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
    }, [showBadgeMessage, user])

    const values = useMemo(() => ({
        isConnected,
        online,
        peak,
        showBadgeMessage
    }), [isConnected, online, peak, showBadgeMessage])

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
