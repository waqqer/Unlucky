import { memo } from "react"
import styles from "./HistoryItem.module.css"
import Head from "@/Components/Decorations/Head"
import type { GameHistory } from "@/Api/History"

interface UIHistoryItemProps {
    data: GameHistory
}

const HistoryItem = (props: UIHistoryItemProps) => {
    const {
        data
    } = props

    return (
        <div className={styles.history}>
            <div className={`${styles.block} ${styles.user}`}>
                <Head size={48} uuid={data.user.uuid || "steve"} />
                <h4>{data.user.name || "Username"}</h4>
            </div>

            <div className={`${styles.block} ${styles.game}`}>
                <h3>{data.result === "WIN" ? "Победа" : "Поражение"}</h3>
                {data.result === "WIN" ?
                    <p>+400 Aр</p>
                    :
                    <p>-400 Aр</p>
                }
            </div>
        </div>
    )
}

export default memo(HistoryItem)