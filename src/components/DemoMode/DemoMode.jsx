import { memo } from "react"
import styles from "./DemoMode.module.css"

const DemoMode = (props) => {
    const {
        className = "",
        enabled,
        onToggle,
        disabled = false
    } = props

    return (
        <div className={`${styles["demo-mode"]} ${className}`}>
            <label className={styles["demo-toggle"]}>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={onToggle}
                    disabled={disabled}
                />
                <span className={styles["toggle-text"]}>Демо режим</span>
            </label>
        </div>
    )
}

export default memo(DemoMode)
