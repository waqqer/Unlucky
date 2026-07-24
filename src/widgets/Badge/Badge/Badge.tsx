import { memo, useEffect, useId, useState } from "react"
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

    const [badge, setBadge] = useState<Badge | null>(null)
    const uniqueId = useId()

    useEffect(() => {
        if (badgeName) {
            if (badgeName in BadgesConfig.badges) {
                setBadge(BadgesConfig.badges[badgeName])
            }
        }
    }, [badgeName, BadgesConfig.badges])

    return (
        <>
            {badgeName && badge && <div
                className={`${styles.badge} ${className}`}
                id={`badge-${uniqueId}`}
                style={{
                    ["--size"]: size
                } as React.CSSProperties}
            >
                <img
                    src={badge.icon}
                    alt="User badge"
                    draggable={false}
                    loading="lazy"
                    width={size}
                    height={size}
                    style={{
                        ["--size"]: size
                    } as React.CSSProperties}
                />
            </div>}

            {tooltip && badge &&

                <Tooltip
                    anchorSelect={`#badge-${uniqueId}`}
                    portalRoot={document.getElementById("tooltips")}
                    delayShow={tooltipDelay}
                    className={styles["badge-tooltip"]}
                    opacity={1}
                >
                    <div className={styles["badge-content"]}>
                        <div className={styles["badge-info"]} style={{
                            ["--color" as string]: BadgesConfig.colors[badge.quality]
                        }}>
                            <h3>{badge.title}</h3>
                        </div>
                        <div>
                            <p>{badge.description}</p>
                        </div>
                    </div>
                </Tooltip>}
        </>
    )

}

export default memo(Badge)