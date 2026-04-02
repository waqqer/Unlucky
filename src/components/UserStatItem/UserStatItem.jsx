import styles from "./UserStatItem.module.css"

const UserStatItem = (props) => {
    const {
        label,
        value,
        valueClass = "",
        fullWidth = false
    } = props

    const ItemClass = fullWidth ? styles["stat-item-full"] : styles["stat-item"]

    return (
        <div className={ItemClass}>
            <span className={styles["stat-label"]}>{label}</span>
            <span className={`${styles["stat-value"]} ${valueClass}`}>{value}</span>
        </div>
    )
}

export default UserStatItem
