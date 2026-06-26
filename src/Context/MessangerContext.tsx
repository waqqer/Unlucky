import { createContext, useMemo, useEffect, useContext, useCallback } from "react"
import { AccountContext } from "./AccountContext"
import connectSocket from "@/Api/Wss"
import type { StreakStatus } from "@/Api/User"
import { toast } from "react-toastify/unstyled"

interface MessageEvent { }
interface NewBadgeEvent extends MessageEvent {
    badge: string
}
interface StreakEvent extends MessageEvent {
    current: number,
    status: StreakStatus
}

export interface MessangerContextValues {
    sendBadgeNotification: (badge: string) => void
}

export const MessangerContext = createContext<MessangerContextValues>(undefined!)

export const MessangerProvider = ({ children }: any) => {
    const { account, setStreakInfo, streak, streakStatus } = useContext(AccountContext)

    const sendBadgeNotification = useCallback((badge: string) => {

    }, [])
    
    useEffect(() => {
        if (!account) return

        const socket = connectSocket("/ws/messanger")

        socket.on("new_badge_event", (data: NewBadgeEvent) => {

        })

        socket.on("streak_event", (data: StreakEvent) => {
            const {
                status,
                current
            } = data

            if(streakStatus === "DEAD" && status === "ACTIVE") {
                toast.success("У вас началась серия!")
            }

            if(streakStatus === "WAITING" && status === "ACTIVE") {
                toast.success("Вы продлили свою серию!")
            }

            if(streakStatus === "WAITING" && status === "DEAD") {
                toast.error("Вы потеряли свою серию!")
            }

            setStreakInfo({
                streak: current,
                status
            })
        })

        return () => {
            socket.off("new_badge_event")
            socket.off("streak_event")
            socket.disconnect()
        }
    }, [account])

    const values: MessangerContextValues = useMemo(() => ({
        sendBadgeNotification
    }), [sendBadgeNotification])

    return (
        <MessangerContext.Provider value={values}>
            {children}
        </MessangerContext.Provider>
    )
}