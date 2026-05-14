import { useCallback, useContext, useEffect, useState } from "react"
import { BADGES_CONFIG } from "@/shared/configs"
import { AccountContext } from "@/context/AccountContext"
import styles from "./Badge.module.css"

const Badge = (props) => {
    const {
        name = ""
    } = props

    const {
        colors,
        null_badge_icon
    } = BADGES_CONFIG

    const { changeCurrentBadge, currentBadge, badges } = useContext(AccountContext)

    const [canChange, setCanChange] = useState(true)
    const [badge, setBadge] = useState({
        title: "Badge",
        descripton: "...",
        icon: null_badge_icon,
        quality: "BASIC"
    })

    useEffect(() => {
        const b = BADGES_CONFIG.badges[name]
        if (b)
            setBadge(b)
    }, [name, badges, currentBadge])

    const handleClick = useCallback(() => {
        if (canChange) {
            if (currentBadge === name) {
                changeCurrentBadge(null)
            } else {
                changeCurrentBadge(name)
            }

            setCanChange(false)
            setTimeout(() => {
                setCanChange(true)
            }, 2000)
        }
    }, [name, canChange])

    return (
        <div className={`${styles.badge} ${currentBadge === name && styles.active}`} style={{ "--color": `${colors[badge.quality]}` }}>
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
                src={badge.icon || null_badge_icon}
                alt="badge icon"
                draggable={false}
                loading="lazy"
                width={44}
                height={44}
                onClick={handleClick}
            />
        </div>
    )
}

export default Badge