import styles from "./StatCard.module.css"

const StatCard = (props) => {
    const {
        icon,
        label,
        value,
        valueColor,
        className
    } = props

    return (
        <div className={`${styles["stat-card"]} ${className || ""}`}>
            <i className={`${styles.icon} ${icon || "fa-solid fa-circle"} mobile-hide`}></i>
            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <span className={`${styles.value} ${valueColor ? styles[valueColor] : ""}`}>
                    {value}
                </span>
            </div>
        </div>
    )
}

export default StatCard
