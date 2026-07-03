import Separator from "@/Components/Decorations/Separator"
import type { GameHistory as GameHistoryRecord } from "@/Api/History"
import { memo } from "react"
import styles from "./GameHistory.module.css"
import HistoryItem from "../../Items/HistoryItem/HistoryItem"

interface UIGameHistoryProps {
    items: GameHistoryRecord[]
    freshKey?: string | null
    isLoading?: boolean
    error?: string | null
}

const getHistoryKey = (item: GameHistoryRecord) => `${item.date}-${item.user.uuid}-${item.amount}`

const GameHistory = (props: UIGameHistoryProps) => {
    const {
        items,
        freshKey = null,
        isLoading = false,
        error = null
    } = props

    return (
        <div className={styles.history}>
            <h3>История</h3>

            <Separator size={100} />

            <div className={styles.list}>
                {isLoading && <p className={styles.message}>Загрузка...</p>}
                {!isLoading && error && <p className={styles.message}>{error}</p>}
                {!isLoading && !error && items.length === 0 && <p className={styles.message}>Пока пусто</p>}
                {!isLoading && !error && items.map((item, index) => (
                    <HistoryItem data={item} key={`${getHistoryKey(item)}-${index}`} isFresh={getHistoryKey(item) === freshKey} />
                ))}
            </div>
        </div>
    )
}

export default memo(GameHistory)
