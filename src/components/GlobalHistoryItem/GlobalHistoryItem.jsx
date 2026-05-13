import styles from "./GlobalHistoryItem.module.css"
import useHead from "@/hooks/useHead"
import { useEffect, useState } from "react"
import BadgeDeco from "../BadgeDeco";

const GlobalHistoryItem = (props) => {
    const {
        data,
        index = 0,
        animate = false
    } = props

    const [shouldAnimate, setShouldAnimate] = useState(false)

    useEffect(() => {
        if (animate) {
            const timer = requestAnimationFrame(() => {
                setShouldAnimate(true)
            })
            return () => cancelAnimationFrame(timer)
        }
    }, [animate])

    const result = data.result ?? "WIN"
    const amount = data.amount ?? 0
    const title = data.game_name ?? "???"
    const username = data.user?.name ?? "Неизвестно"
    const userUUID = data.user?.UUID ?? ""
    const avatarUrl = useHead(userUUID)

    return (
        <div
            className={`${styles[`history-item-${result}`]} ${shouldAnimate ? styles["history-item-animate"] : ""}`}
            style={shouldAnimate ? { animationDelay: `${index * 0.05}s` } : {}}
        >
            <img
                src={avatarUrl}
                alt={username}
                className={styles.avatar}
                loading="lazy"
                draggable={false}
            />
            <div className={styles.data}>
                <div className={styles.user}>
                    <h1 className={styles.username}>{username}</h1>
                    <BadgeDeco uuid={userUUID} size={20} />
                </div>
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
