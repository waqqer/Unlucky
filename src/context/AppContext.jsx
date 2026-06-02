import { createContext, useEffect, useMemo, useState, useRef, useCallback, useContext } from "react"
import { createPortal } from "react-dom"
import BadgeMessage from "@/components/BadgeMessage"
import { AccountContext } from "./AccountContext";
import { ensureValidToken, getToken, getTokenUuid } from "@/api/auth"

export const AppContext = createContext({})

const badgeShowTime = 3000

export const AppProvider = ({ children }) => {
    const [online, setOnline] = useState(0)
    const [peak, setPeak] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [badgeMessage, setBadgeMessage] = useState(null)
    const { user, isLoaded } = useContext(AccountContext)

    const socketRef = useRef(null)
    const timeoutRef = useRef(null)
    const wsListenersRef = useRef(new Set())

    const sendWsMessage = useCallback((message) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message))
        }
    }, [])

    const subscribeWsMessage = useCallback((handler) => {
        wsListenersRef.current.add(handler)
        return () => wsListenersRef.current.delete(handler)
    }, [])

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
        if (!user || !isLoaded)
            return

        let cancelled = false

        const connect = async () => {
            await ensureValidToken(user)
            const token = getToken()
            const uuid = getTokenUuid() || user.minecraftUUID
            if (cancelled || !token || !uuid)
                return

            let url = import.meta.env.VITE_BACKEND_URL
            url = url.replace(/^https:/, "wss:").replace(/^http:/, "ws:")
            url = `${url.replace(/\/$/, "")}/${uuid}?token=${encodeURIComponent(token)}`

            const socket = new WebSocket(url)
            socketRef.current = socket

            socket.onopen = () => {
                if (!cancelled)
                    setIsConnected(true)
            }

            socket.onmessage = (ev) => {
                let data
                try {
                    data = JSON.parse(ev.data)
                } catch {
                    return
                }
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

                wsListenersRef.current.forEach((handler) => handler(data))
            }

            socket.onclose = () => {
                setIsConnected(false)
                if (!cancelled)
                    setTimeout(connect, 5000)
            }

            socket.onerror = () => { }
        }

        connect()

        return () => {
            cancelled = true

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [user, isLoaded])

    const values = useMemo(() => ({
        isConnected,
        online,
        peak,
        showBadgeMessage,
        sendWsMessage,
        subscribeWsMessage
    }), [isConnected, online, peak, showBadgeMessage, sendWsMessage, subscribeWsMessage])

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
