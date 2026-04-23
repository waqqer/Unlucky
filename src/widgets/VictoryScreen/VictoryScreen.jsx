import { useEffect, useCallback, useRef } from "react"
import VictoryVideo from "../VictoryVideo"
import styles from "./VictoryScreen.module.css"

const AUTO_CLOSE_DELAY = 3000

const formatAmount = (value) => {
    const num = Number(value)
    if (!Number.isFinite(num)) return "0"

    const rounded = num > 0
        ? Math.ceil(num - Number.EPSILON)
        : Math.round(num + Number.EPSILON)
    const safe = Object.is(rounded, -0) ? 0 : rounded

    return new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(safe)
}

const VictoryScreen = (props) => {
    const {
        isOpen,
        onClose,
        onVictoryComplete,
        winAmount = 0
    } = props

    const hasTriggeredComplete = useRef(false)
    const closeTimerRef = useRef(null)

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose()
        }
    }, [onClose])

    useEffect(() => {
        if (!isOpen) {
            hasTriggeredComplete.current = false
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
                closeTimerRef.current = null
            }
            return
        }

        if (onVictoryComplete && !hasTriggeredComplete.current) {
            hasTriggeredComplete.current = true
            onVictoryComplete()
        }
        closeTimerRef.current = setTimeout(() => {
            handleClose()
        }, AUTO_CLOSE_DELAY)

        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
                closeTimerRef.current = null
            }
        }
    }, [isOpen, handleClose, onVictoryComplete])

    if (!isOpen) {
        return null
    }

    return (
        <div className={styles["victory-screen"]}>
            <VictoryVideo className={styles["victory-video"]} />
            <div className={styles["victory-content"]}>
                <h1 className={styles["victory-title"]}>Ты победил</h1>
                <p className={styles["victory-amount"]}>+{formatAmount(winAmount)} Ар</p>
            </div>
        </div>
    )
}

export default VictoryScreen
