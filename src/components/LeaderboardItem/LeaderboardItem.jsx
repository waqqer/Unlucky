import { memo } from "react"
import useHead from "@/hooks/useHead"
import styles from "./LeaderboardItem.module.css"
import Badgedeco from "../BadgeDeco"

const top_styles = {
    1: styles.first,
    2: styles.second,
    3: styles.third
}

const LeaderboardItem = (props) => {
    const {
        id,
        uuid = "",
        name = "noname",
        value = 0
    } = props

    const head = useHead(uuid)

    return (
        <div key={id} className={`${styles.leader} ${top_styles[id] || ""}`}>
            <div className={styles.info}>
                <h2 className={styles.id}>#{id}</h2>
                <div className={`${styles.user}`}>
                    <img 
                        src={head} 
                        alt="leader head icon" 
                        draggable={false}
                        loading="lazy"
                        width={40}
                        height={40}
                    />
                    <h2 className={styles.name}>{name || "noname"} <Badgedeco uuid={uuid} className="mobile-hide" /> </h2>
                </div>
            </div>

            <h2 className={styles.value}>
                {value || 0} 
                {id === 1 && <i className="fa-solid fa-crown"></i>}
            </h2>
        </div>
    )
}

export default memo(LeaderboardItem)