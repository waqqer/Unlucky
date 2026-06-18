import Separator from "@/Components/Decorations/Separator"
import { memo } from "react"
import styles from "./GameHistory.module.css"

const GameHistory = () => {
    return (
        <div className={styles.history}>
            <h2>История</h2>

            <Separator />

            <div className={styles.list}>
                <h1>sd</h1>
                <h1>sd</h1>
                <h1>sd</h1>
                <h1>sd</h1>
                <h1>sd</h1>
                <h1>sd</h1>
            </div>
        </div>
    )
}

export default memo(GameHistory)