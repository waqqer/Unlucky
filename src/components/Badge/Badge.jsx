import { memo, useEffect, useState } from "react"
import { BADGES_CONFIG } from "@/shared/configs"
import styles from "./Badge.module.css"

const Badge = (props) => {
    const {
        name = "slots"
    } = props

    const {
        badges,
        colors,
        null_badge_icon
    } = BADGES_CONFIG

    const [badge, setBadge] = useState({
        title: "Badge",
        descripton: "...",
        icon: null_badge_icon,
        quality: "BASIC"
    })

    useEffect(() => {
        console.log(badges[name])
        const b = badges[name]
        if (b)
            setBadge(b)
    }, [])

    return (
        <div className={`${styles.badge}`} style={{ "--color": `${colors[badge.quality]}` }}>
            <div className={styles.info}>
                <div className={styles.title}>
                    <h3>{badge.title}</h3>
                </div>
                <div className={styles.desc}>
                    <p>{badge.descripton}</p>
                </div>
            </div>

            <img
                className={`${styles.icon}`}
                src={badge.icon}
                alt="badge icon"
                draggable={false}
                loading="lazy"
                width={48}
                height={48}
            />
        </div>
    )
}

export default memo(Badge)