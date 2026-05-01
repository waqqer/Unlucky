import { createContext, useEffect, useMemo, useState, useRef } from "react"

export const AppContext = createContext({})

export const AppProvider = ({ children }) => {
    const [online, setOnline] = useState(0)
    const [peak, setPeak] = useState(0)
    const [isConnected, setIsConnected] = useState(false)

    const socketRef = useRef(null);

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
            }

            socket.onclose = () => {
                setIsConnected(false)
                setTimeout(connect, 5000)
            }

            socket.onerror = (err) => {
                console.error("Ошибка подключения ", err)
            }
        }

        connect()

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        }
    }, [])


    const values = useMemo(() => ({
        isConnected,
        online,
        peak
    }), [isConnected, online, peak])

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}
