import { memo, useEffect, useState } from "react"
import TopApi from "@/api/top"
import StatsGroup from "@/components/StatsGroup"
import UserTopItem from "@/components/UserTopItem"
import styles from "./UserStats.module.css"

const limit = 20

const UserStats = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        TopApi.getWinners(limit)
            .then(d => setUsers(d))
    }, [])

    return (
        <StatsGroup title="Топ игроков">
            <div className={styles["top-list"]}>
                {users.length === 0 ?
                    <p className={styles.empty}>Тут пусто((...</p>
                    :
                    users.map((u, i) => <UserTopItem key={i} userData={u} number={i + 1} />) 
                }
            </div>
        </StatsGroup>
    )
}

export default memo(UserStats)