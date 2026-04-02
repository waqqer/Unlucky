import styles from "./GameStatItem.module.css"

const GameStatItem = (props) => {
    const {
        name,
        count,
        icon
    } = props

    return (
        <div className={styles["game-stat-item"]}>
            <i className={`${styles.icon} ${icon || "fa-solid fa-dice"}`}></i>
            <div className={styles.content}>
                <span className={styles.name}>{name}</span>
                <span className={styles.count}>{count}</span>
            </div>
        </div>
    )
}

export default GameStatItem
