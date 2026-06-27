import { memo, useContext, useEffect, useMemo, useRef, useCallback, useState } from "react"
import image from "@/Shared/Assets/Images/badge_notification.webp"
import styles from "./BadgeNotification.module.css"
import { BadgesConfig } from "@/Shared/Configs"
import { MessangerContext } from "@/Context/MessangerContext"

const BadgeNotification = () => {
    const notifRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<number>(null)
    const removeTimerRef = useRef<number>(null)
    const queueRef = useRef<string[]>([])
    const isShowingRef = useRef(false)

    const { badgeMessage, setBadgeMessage } = useContext(MessangerContext)
    const [currentBadge, setCurrentBadge] = useState<string | null>(null)

    const achievedBadge = useMemo(() => {
        if (!currentBadge) return null
        return BadgesConfig.badges[currentBadge]
    }, [currentBadge])

    const showNext = useCallback(() => {
        if (queueRef.current.length === 0) {
            isShowingRef.current = false
            setCurrentBadge(null)
            return
        }

        const next = queueRef.current.shift()
        setCurrentBadge(next)
        isShowingRef.current = true

        if (notifRef.current) {
            notifRef.current.classList.remove(styles.hidden)
        }
    }, [])

    useEffect(() => {
        if (!badgeMessage) return

        if (isShowingRef.current) {
            queueRef.current.push(badgeMessage)
            setBadgeMessage(null)
            return
        }

        setCurrentBadge(badgeMessage)
        isShowingRef.current = true
        setBadgeMessage(null)

        if (notifRef.current) {
            notifRef.current.classList.remove(styles.hidden)
        }
    }, [badgeMessage, setBadgeMessage])

    useEffect(() => {
        if (!currentBadge || !achievedBadge) return

        if (timerRef.current) clearTimeout(timerRef.current)
        if (removeTimerRef.current) clearTimeout(removeTimerRef.current)

        timerRef.current = setTimeout(() => {
            if (notifRef.current) {
                notifRef.current.classList.add(styles.hidden)
            }
        }, 2500)

        removeTimerRef.current = setTimeout(() => {
            showNext()
        }, 3500)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            if (removeTimerRef.current) clearTimeout(removeTimerRef.current)
        }
    }, [currentBadge, achievedBadge, showNext])

    if (!currentBadge || !achievedBadge) {
        return null
    }

    return (
        <div
            className={styles.notif}
            style={{
                ["--img" as string]: `url(${image})`
            }}
            ref={notifRef}
        >
            <div className={styles.icon}>
                <img
                    src={achievedBadge.icon}
                    alt="Badge icon"
                    draggable={false}
                    loading="lazy"
                />
            </div>

            <div className={styles.info}>
                <h3 style={{
                    color: BadgesConfig.colors[achievedBadge.quality]
                }}>{achievedBadge.title}</h3>
                <p>{achievedBadge.description}</p>
            </div>
        </div>
    )
}

export default memo(BadgeNotification)