import Separator from "@/Components/Decorations/Separator/Separator"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo } from "react"
import styles from "./Leaderboard.module.css"

interface UILeaderboardProps extends Parent, Classable {
    title?: string
}

const Leaderboard = (props: UILeaderboardProps) => {
    const {
        children,
        className = "",
        title = "Рейтинг"
    } = props

    return (
        <div className={`${styles.leaderbord} ${className}`}>
            <h2 className={styles.title}>{title}</h2>
            <Separator size={100} />
            <div className={styles.list}>
                {children ?
                    children 
                    :
                    <p className={styles.error}>Тут пока ничего нет...(</p>}
            </div>
        </div>
    )
}

export default memo(Leaderboard)