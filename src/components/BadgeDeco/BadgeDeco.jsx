import { memo, useContext, useEffect, useState } from "react"
import { BADGES_CONFIG } from "@/shared/configs/badges"
import { AccountContext } from "@/context/AccountContext"
import UserApi from "@/api/users";
import styles from "./BadgeDeco.module.css"

const BadgeDeco = (props) => {
    const {
        uuid,
        size = 32,
        className = ""
    } = props

    const [icon, setIcon] = useState(null)
    const { currentBadge, badges } = useContext(AccountContext)

    useEffect(() => {
        if (!uuid) return

        UserApi.getBadges(uuid).then(d => {
            setIcon(BADGES_CONFIG.badges[d.current || null]?.icon || null)
        })
    }, [uuid])

    useEffect(() => {
        if (uuid) return

        setIcon(BADGES_CONFIG.badges[currentBadge]?.icon || null)
    }, [uuid, currentBadge, badges])

    return (
        <>
            {icon !== null && <img
                src={icon}
                className={`${styles.icon} ${className}`}
                width={size}
                height={size}
                draggable={false}
                loading="lazy"
            />}
        </>
    )
}

export default BadgeDeco