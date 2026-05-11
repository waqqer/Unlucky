import { memo } from "react"
import styles from "./Leaderboard.module.css"
import Leaderboarditem from "../LeaderboardItem";

const Leaderboard = (props) => {
    const {
        data = [],
        title = "Лидеры"
    } = props

    return (
        <div className={styles.top}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.list}>
                {data.length > 0 && data.map((d, i) => 
                    <Leaderboarditem id={i + 1} uuid={d.uuid} name={d.name} value={d.value}/>
                )}
            </div>
        </div>
    )
}

export default Leaderboard