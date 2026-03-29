import styles from "./SlotReel.module.css"

const SlotReel = (props) => {
    const {
        className,
        symbol,
        isSpinning = false
    } = props

    return (
        <div className={`${styles["slot-reel"]} ${className} ${isSpinning ? styles.spinning : ""}`}>
            <div className={styles["reel-content"]}>
                <span className={styles.symbol}>{symbol}</span>
            </div>
        </div>
    )
}

export default SlotReel
