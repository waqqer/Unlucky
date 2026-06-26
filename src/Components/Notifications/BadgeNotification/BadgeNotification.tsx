import { memo, useEffect, useMemo, useRef } from "react"
import image from "@/Shared/Assets/Images/badge_notification.webp"
import styles from "./BadgeNotification.module.css"
import { BadgesConfig } from "@/Shared/Configs"

interface UIBadgeNotificatioProps {
    badge?: string
}

const BadgeNotification = (props: UIBadgeNotificatioProps) => {
    const {
        badge
    } = props

    const notifRef = useRef<HTMLDivElement>(null)

    const achievedBadge = useMemo(() => {
        if(!badge) return null
        return BadgesConfig.badges[badge]
    }, [badge])

    useEffect(() => {
        const timer = setTimeout(() => {
            if(notifRef.current) {
                notifRef.current.classList.add(styles.hidden)
            }
        }, 6000)

        return () => {
            clearTimeout(timer)
            if(notifRef.current) {
                notifRef.current = null
            }
        }
    }, [])

    if(!achievedBadge) {
        return
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