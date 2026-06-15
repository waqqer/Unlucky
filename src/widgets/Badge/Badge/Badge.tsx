import { memo, useEffect, useState } from "react"
import styles from "./Badge.module.css"
import type { Classable, Resizable } from "@/Shared/Types/PropsTypes"
import { BadgesConfig } from "@/Shared/Configs"
import { type Badge } from "@/Shared/Configs/Badges"
import { Tooltip } from 'react-tooltip'

interface UIBadgeProps extends Classable, Resizable {
    badgeName?: string,
    tooltip?: boolean,
    tooltipDelay?: number
}

const Badge = (props: UIBadgeProps) => {
    const {
        className = "",
        badgeName,
        size = 64,
        tooltip = false,
        tooltipDelay = 0
    } = props

    const [badge, setBadge] = useState<Badge>(BadgesConfig.nullBadge)

    useEffect(() => {
        if (badgeName) {
            if (badgeName in BadgesConfig.badges) {
                setBadge(BadgesConfig.badges[badgeName])
            }
        }
    }, [badgeName])

    return (
        <>
            {badgeName && <div className={`${styles.badge} ${className}`}>
                <img
                    src={badge.icon}
                    alt="User badge"
                    draggable={false}
                    loading="lazy"
                    width={size}
                    height={size}
                />
            </div>}

            <Tooltip anchorSelect={`.${styles.badge}`} place="top" delayShow={tooltipDelay}>
                Helo
            </Tooltip>
        </>
    )

}

export default memo(Badge)