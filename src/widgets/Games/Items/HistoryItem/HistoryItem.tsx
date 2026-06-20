import { memo } from "react"
import styles from "./HistoryItem.module.css"
import Head from "@/Components/Decorations/Head"

const HistoryItem = () => {
    return (
        <div className={styles.history}>
            <div className={`${styles.block} ${styles.user}`}>
                <Head size={48} />
                <h4>Username</h4>
            </div>

            <div className={`${styles.block} ${styles.game}`}>
                <h3>Победа</h3>
                <p>+400 Aр</p>
            </div>
        </div>
    )
}

export default memo(HistoryItem)