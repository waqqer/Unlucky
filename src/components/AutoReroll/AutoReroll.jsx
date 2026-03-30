import styles from "./AutoReroll.module.css"

const AutoReroll = (props) => {
    const {
        className,
        enabled,
        onToggle,
        disabled = false
    } = props

    return (
        <div className={`${styles["auto-reroll"]} ${className}`}>
            <label className={styles["reroll-toggle"]}>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={onToggle}
                    disabled={disabled}
                />
                <span className={styles["toggle-text"]}>Авто-реролл</span>
            </label>
        </div>
    )
}

export default AutoReroll
