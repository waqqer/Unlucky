import { memo } from "react"
import styles from "./StatsGroup.module.css"

const StatsGroup = (props) => {
    const {
        title,
        children,
        className = ""
    } = props

    return (
        <div className={`${styles["stats-group"]} ${className || ""}`}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.cards}>
                {children}
            </div>
        </div>
    )
}

export default memo(StatsGroup)
