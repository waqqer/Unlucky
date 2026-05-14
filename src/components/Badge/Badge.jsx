import { memo, useCallback, useContext, useMemo, useState } from "react"
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

    const { changeCurrentBadge, currentBadge } = useContext(AccountContext)

    const [canChange, setCanChange] = useState(true)

    const badge = useMemo(() => {
        return BADGES_CONFIG.badges[name] || {
            title: "Badge",
            descripton: "...",
            icon: null_badge_icon,
            quality: "BASIC"
        }
    }, [name, null_badge_icon])

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
    }, [name, canChange, currentBadge, changeCurrentBadge])

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

export default memo(Badge)