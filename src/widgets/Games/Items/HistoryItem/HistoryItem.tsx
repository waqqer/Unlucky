import { memo } from "react"
import styles from "./HistoryItem.module.css"
import Head from "@/Components/Decorations/Head"
import type { GameHistory } from "@/Api/History"
import Username from "@/Components/Info/Username"

interface UIHistoryItemProps {
    data: GameHistory
    isFresh?: boolean
}

const HistoryItem = (props: UIHistoryItemProps) => {
    const {
        data,
        isFresh = false
    } = props
    const amount = Math.abs(data.amount)
    const sign = amount === 0 ? "" : data.result === "WIN" ? "+" : "-"

    return (
        <div className={`${styles.history} ${isFresh ? styles.fresh : ""}`}>
            <div className={`${styles.block} ${styles.user}`}>
                <Head size={48} uuid={data.user.uuid || "steve"} />
                <Username User={{
                    current_badge: data.user.badge,
                    name: data.user.name
                }} withBadge={true} badgeTooltip={true} />
            </div>

            <div className={`${styles.block} ${styles.game}`}>
                <h3>{data.result === "WIN" ? "Победа" : "Поражение"}</h3>
                <p className={data.result === "WIN" ? styles.win : styles.lose}>{sign}{amount} Ар</p>
            </div>
        </div>
    )
}

export default memo(HistoryItem)
