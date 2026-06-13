import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { AuthContext } from "./AuthContext"
import type { OnlineStats } from "@/Shared/Types/ServiceTypes"
import connectSocket from "@/Api/Wss"
import { toast } from "react-toastify"

export interface OnlineContextValues extends OnlineStats { }

export const OnlineContext = createContext<OnlineContextValues>(undefined!)

export const OnlineProvider = ({ children }: any) => {
    const { isAuth } = useContext(AuthContext)

    const [online, setOnline] = useState<number>(0)
    const [peak, setPeak] = useState<number>(0)

    useEffect(() => {
        if (!isAuth)
            return

        const socket = connectSocket("/ws/online")

        socket.on("online_update", (data: OnlineStats) => {
            setOnline(data.current)
            setPeak(data.peak)
        })

        socket.on("connect_error", _ => toast.error("Невозможно подключиться к серверу!"))

        return () => {
            socket.off("connect_error")
            socket.off("connect_failed")
            socket.off("online_update")
            socket.disconnect()
        }
    }, [isAuth])


    const values: OnlineContextValues = useMemo(() => ({
        current: online,
        peak
    }), [online, peak])

    return (
        <OnlineContext.Provider value={values}>
            {children}
        </OnlineContext.Provider>
    )
}