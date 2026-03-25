import styles from "./HistoryItem.module.css"

const HistoryItem = (props) => {
    const {
        data
    } = props

    const result = data.result ?? "WIN"
    const amount = data.amount ?? 0
    const title = data.game_name ?? "???"

    return (
        <div className={styles[`history-item-${result}`]}>
            <div className={styles.data}>
                <h1 className={styles["game-name"]}>{title}</h1>
                <p className={styles.amount}>
                    {amount > 0 ? `+${amount}` : `${amount}`}
                </p>
            </div>

            <h1 className={styles.result}>
                {result === "WIN" ? "Победа" : "Поражение"}
            </h1>
        </div>
    )
}

export default HistoryItem