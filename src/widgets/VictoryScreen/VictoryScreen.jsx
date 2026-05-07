import { useEffect, useCallback, useRef, useState } from "react"
import VictoryVideo from "../VictoryVideo"
import styles from "./VictoryScreen.module.css"

const AUTO_CLOSE_DELAY = 3000
const COUNT_UP_DURATION_MS = 2200

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

const easeOutQuad = (t) => 1 - (1 - t) * (1 - t)

const toCountTarget = (raw) => {
    const n = Number(raw)
    if (!Number.isFinite(n)) return 0
    return Math.max(0, Math.round(n))
}

const VictoryScreen = (props) => {
    const {
        isOpen,
        onClose,
        onVictoryComplete,
        winAmount = 0
    } = props

    const [displayAmount, setDisplayAmount] = useState(0)
    const hasTriggeredComplete = useRef(false)
    const closeTimerRef = useRef(null)
    const countUpRafRef = useRef(null)
    const amountRef = useRef(null)
    const screenRef = useRef(null)

    const handleClose = useCallback(() => {
        if(screenRef.current) {
            screenRef.current.classList.add(styles["fade-up"]);
        }

        setTimeout(() => {
            if (onClose)
                onClose()
        }, 1250)
    }, [onClose])

    const triggerPopAnimation = useCallback(() => {
        if (!amountRef.current) return
        amountRef.current.classList.remove(styles["pop"])
        void amountRef.current.offsetWidth
        amountRef.current.classList.add(styles["pop"])
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setDisplayAmount(0)
            if (countUpRafRef.current != null) {
                cancelAnimationFrame(countUpRafRef.current)
                countUpRafRef.current = null
            }
            return
        }

        if (countUpRafRef.current != null) {
            cancelAnimationFrame(countUpRafRef.current)
            countUpRafRef.current = null
        }

        const target = toCountTarget(winAmount)
        const start = performance.now()

        const tick = (now) => {
            const t = target === 0 ? 1 : Math.min(1, (now - start) / COUNT_UP_DURATION_MS)
            const eased = easeOutQuad(t)
            const value = target === 0 ? 0 : Math.min(target, Math.round(eased * target))
            setDisplayAmount(value)
            if (t < 1) {
                countUpRafRef.current = requestAnimationFrame(tick)
            } else {
                setDisplayAmount(target)
                triggerPopAnimation()
                countUpRafRef.current = null
            }
        }

        countUpRafRef.current = requestAnimationFrame(tick)

        return () => {
            if (countUpRafRef.current != null) {
                cancelAnimationFrame(countUpRafRef.current)
                countUpRafRef.current = null
            }
        }
    }, [isOpen, winAmount, triggerPopAnimation])

    useEffect(() => {
        if (!isOpen) {
            hasTriggeredComplete.current = false
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
            return
        }

        if (onVictoryComplete && !hasTriggeredComplete.current) {
            hasTriggeredComplete.current = true
            onVictoryComplete()
        }

        const closeDelay = COUNT_UP_DURATION_MS + AUTO_CLOSE_DELAY

        closeTimerRef.current = setTimeout(() => {
            handleClose()
        }, closeDelay)

        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        }
    }, [isOpen, handleClose, onVictoryComplete, winAmount])

    if (!isOpen) return null

    return (
        <div className={styles["victory-screen"]} ref={screenRef}>
            <VictoryVideo className={styles["victory-video"]} />
            <div className={styles["victory-content"]}>
                <h1 className={styles["victory-title"]}>Ты победил!</h1>
                <p ref={amountRef} className={styles["victory-amount"]}>
                    +{formatAmount(displayAmount)} Ар
                </p>
            </div>
        </div>
    )
}

export default VictoryScreen