import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./HistoryItem.module.css"

const HistoryItem = (props) => {
    const {
        data,
        index = 0
    } = props

    const { user } = useContext(AccountContext)

    const result = data.result ?? "WIN"
    const amount = data.amount ?? 0
    const title = data.game_name ?? "???"
    const createdAt = data.game_date ? new Date(data.game_date) : null

    const formatDate = (date) => {
        if (!date) return ""
        return date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    return (
        <div
            className={`${styles[`history-item-${result}`]} ${styles["history-item-animate"]}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className={styles.data}>
                <h1 className={styles["game-name"]}>{title}</h1>
                {createdAt && (
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
