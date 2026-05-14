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

    const isEmptyObject = (val) =>
        typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val).length === 0

    const rawDate = isEmptyObject(data.game_date)
        ? (data.created_at ?? data.createdAt ?? data.date ?? data.timestamp ?? data.datetime ?? null)
        : (data.game_date ?? null)

    if (rawDate) {
        try {
            if (typeof rawDate === 'string') {
                createdAt = new Date(rawDate.trim().replace(' ', 'T'))
            } else if (rawDate instanceof Date) {
                createdAt = rawDate
            } else if (typeof rawDate === 'number') {
                createdAt = new Date(rawDate)
            } else if (typeof rawDate === 'object') {
                const extracted = rawDate.date || rawDate.datetime || rawDate.time || null
                if (typeof extracted === 'string') {
                    createdAt = new Date(extracted.trim().replace(' ', 'T'))
                }
            }
        } catch (e) {
            console.error("Failed to parse date:", rawDate, e)
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
