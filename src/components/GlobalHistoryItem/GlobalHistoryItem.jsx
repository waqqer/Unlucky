import styles from "./GlobalHistoryItem.module.css"
import useHead from "@/hooks/useHead"

const GlobalHistoryItem = (props) => {
    const {
        data,
        index = 0
    } = props

    const result = data.result ?? "WIN"
    const amount = data.amount ?? 0
    const title = data.game_name ?? "???"
    const username = data.user?.username ?? "Неизвестно"
    const userUUID = data.user?.UUID ?? ""
    const avatarUrl = useHead(userUUID)

    return (
        <div 
            className={`${styles[`history-item-${result}`]} ${styles["history-item-animate"]}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <img
                src={avatarUrl}
                alt={username}
                className={styles.avatar}
            />
            <div className={styles.data}>
                <h1 className={styles.username}>{username}</h1>
                <h1 className={styles["game-name"]}>{title}</h1>
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

export default GlobalHistoryItem
