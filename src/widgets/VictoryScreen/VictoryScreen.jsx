import { useEffect, useCallback } from "react"
import VictoryVideo from "../VictoryVideo"
import styles from "./VictoryScreen.module.css"

const VictoryScreen = (props) => {
    const {
        isOpen,
        onClose,
        winAmount = 0
    } = props

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose()
        }
    }, [onClose])

    useEffect(() => {
        if (!isOpen) return

        const timer = setTimeout(() => {
            handleClose()
        }, 3000)

        return () => clearTimeout(timer)
    }, [isOpen, handleClose])

    if (!isOpen) {
        return null
    }

    return (
        <div className={styles["victory-screen"]}>
            <VictoryVideo className={styles["victory-video"]} />
            <div className={styles["victory-content"]}>
                <h1 className={styles["victory-title"]}>🎉 Ты победил! 🎉</h1>
                <p className={styles["victory-amount"]}>+{winAmount} Ар</p>
            </div>
        </div>
    )
}

export default VictoryScreen
