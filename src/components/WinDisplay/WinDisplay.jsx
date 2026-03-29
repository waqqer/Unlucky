import styles from "./WinDisplay.module.css"

const WinDisplay = (props) => {
    const {
        className,
        amount = 0
    } = props

    if (amount <= 0) {
        return null
    }

    return (
        <div className={`${styles["win-display"]} ${className}`}>
            <span className={styles["win-label"]}>Выигрыш:</span>
            <span className={styles["win-amount"]}>+{amount} Ар</span>
        </div>
    )
}

export default WinDisplay
