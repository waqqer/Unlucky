import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { BADGES_CONFIG } from "@/shared/configs/badges"
import { AccountContext } from "@/context/AccountContext"
import UserApi from "@/api/users";
import styles from "./BadgeDeco.module.css"

const BadgeDeco = (props) => {
    const {
        uuid,
        size = 32,
        className = "",
        info = true
    } = props

    const [fetchedBadge, setFetchedBadge] = useState(null)
    const [show, setShow] = useState(false)
    const [visible, setVisible] = useState(false)
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
    const iconRef = useRef(null)
    const hideTimerRef = useRef(null)
    const { currentBadge } = useContext(AccountContext)

    useEffect(() => {
        if (!uuid) return

        UserApi.getBadges(uuid).then(d => {
            setFetchedBadge(d.current || null)
        })
    }, [uuid])

    const badgeName = useMemo(() => {
        if (!uuid) return currentBadge || null
        return fetchedBadge
    }, [uuid, currentBadge, fetchedBadge])

    const icon = badgeName ? BADGES_CONFIG.badges[badgeName]?.icon || null : null
    const badgeInfo = badgeName ? BADGES_CONFIG.badges[badgeName] : null

    const hideTooltip = useCallback(() => {
        setVisible(false)
        hideTimerRef.current = setTimeout(() => {
            setShow(false)
        }, 200)
    }, [])

    const showTooltip = useCallback(() => {
        if (!badgeInfo || !iconRef.current) return
        const rect = iconRef.current.getBoundingClientRect()
        const tooltipHeight = 100
        const tooltipWidth = 200

        let top = rect.top - tooltipHeight + 24
        let left = rect.left + rect.width / 2 - tooltipWidth / 2

        if (left < 10) left = 10
        if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10
        }

        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        setTooltipPos({ top, left })
        setShow(true)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true))
        })
    }, [badgeInfo])

    useEffect(() => {
        if (!show) return
        const handleHide = () => hideTooltip()
        window.addEventListener("scroll", handleHide, true)
        window.addEventListener("resize", handleHide)
        return () => {
            window.removeEventListener("scroll", handleHide, true)
            window.removeEventListener("resize", handleHide)
        }
    }, [show, hideTooltip])

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        }
    }, [])

    return (
        <>
            {icon !== null && (
                <img
                    ref={iconRef}
                    src={icon}
                    alt="user badge"
                    className={`${styles.icon} ${className}`}
                    width={size}
                    height={size}
                    draggable={false}
                    loading="lazy"
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                />
            )}
            {show && badgeInfo && info && createPortal(
                <div
                    className={`${styles.tooltip} ${visible ? styles.tooltipVisible : ""}`}
                    style={{
                        top: tooltipPos.top,
                        left: tooltipPos.left,
                        "--color": BADGES_CONFIG.colors[badgeInfo.quality]
                    }}
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                >
                    <div className={styles.title}>
                        <h3>{badgeInfo.title}</h3>
                    </div>
                    <div className={styles.desc}>
                        <p>{badgeInfo.descripton}</p>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export default memo(BadgeDeco)