import Separator from "@/Components/Decorations/Separator"
import { memo } from "react"
import styles from "./GameHistory.module.css"
import HistoryItem from "../../Items/HistoryItem/HistoryItem"

const GameHistory = () => {
    return (
        <div className={styles.history}>
            <h3>История</h3>

            <Separator size={100} />

            <div className={styles.list}>
                <HistoryItem />
                <HistoryItem />
                <HistoryItem />
                <HistoryItem />
                <HistoryItem />
                <HistoryItem />
                <HistoryItem />
                <HistoryItem />
                <HistoryItem />
            </div>
        </div>
    )
}

export default memo(GameHistory)