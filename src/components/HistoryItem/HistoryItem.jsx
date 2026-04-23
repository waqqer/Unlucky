import styles from "./HistoryItem.module.css"

const HistoryItem = (props) => {
    const {
        data,
        index = 0
    } = props

    const result = data.result ?? "WIN"
    const amount = data.amount ?? 0
    const title = data.game_name ?? "???"

    let createdAt = null
    if (data.game_date) {
        try {
            if (typeof data.game_date === 'string') {
                createdAt = new Date(data.game_date.replace(' ', 'T'))
            } else if (data.game_date instanceof Date) {
                createdAt = data.game_date
            } else {
                createdAt = new Date(data.game_date)
            }
        } catch (e) {
            console.error("Failed to parse date:", data.game_date, e)
        }
    }

    const formatDate = (date) => {
        if (!date || isNaN(date.getTime())) {
            return ""
        }
        const time = date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        })

        if(!time || time === "") {
            return "date"
        }
        return time
    }

    const animate = index !== null

    return (
        <div
            className={`${styles[`history-item-${result}`]} ${animate ? styles["history-item-animate"] : ""}`}
            style={animate ? { animationDelay: `${index * 0.05}s` } : {}}
        >
            <div className={styles.data}>
                <h1 className={styles["game-name"]}>{title}</h1>
                {createdAt && !isNaN(createdAt.getTime()) && (
                    <p className={styles.date}>{formatDate(createdAt)}</p>
                )}
            </div>
            <div className={styles.result}>
                <p className={styles["result-text"]}>
                    {result === "WIN" ? "Победа" : "Поражение"}
                </p>
                <p className={`${styles.amount} ${styles[`amount-${result}`]}`}>
                    {amount > 0 ? `+${amount}` : `${amount}`}
                </p>
            </div>
        </div>
    )
}

export default HistoryItem
