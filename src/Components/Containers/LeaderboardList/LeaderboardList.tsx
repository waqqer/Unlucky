import { memo } from "react"
import styles from "./LeaderboardList.module.css"
import type { Classable, Identical } from "@/Shared/Types/PropsTypes"
import LeaderboardItem from "../LeaderboardItem"

interface LeaderboardListProps extends Identical, Classable {
    data: any[],
    title?: string
}

const LeaderboardList = (props: LeaderboardListProps) => {
    const {
        className = "",
        id = "",
        data,
        title
    } = props

    return (
        <div id={id} className={`${styles.leaderboard} ${className}`}>
            {title && <h1 className={styles.title}>{title}</h1>}
            <div className={styles.list}>
                {data.map((v, i) => (
                    <LeaderboardItem data={v}/>
                ))}
            </div>
        </div>
    )
}

export default memo(LeaderboardList)