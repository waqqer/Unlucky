import { useState, useEffect, useContext, memo } from "react"
import { AccountContext } from "@/context/AccountContext"
import StatsApi from "@/api/statistics"
import UserStatItem from "@/components/UserStatItem"
import Placeholder from "@/components/Placeholder"
import styles from "./StatsSection.module.css"

const StatsSection = (props) => {
    const {
        className = ""
    } = props

    const {
        user,
        isLoaded
    } = useContext(AccountContext)

    const [stats, setStats] = useState(null)

    useEffect(() => {
        if (!user?.minecraftUUID) return

        StatsApi.getByUuid(user.minecraftUUID)
            .then(data => setStats(data))
            .catch(() => {
                setStats(null)
            })
    }, [user?.minecraftUUID])

    return (
        <div className={`${styles["stats-section"]} ${className}`}>
            <div className={styles.header}>
                <button className={styles["stats-btn"]}>Статистика</button>
            </div>

            {isLoaded === true ?
                <div className={styles["stats-list"]}>
                    <div className={styles["stat-row"]}>
                        <UserStatItem
                            label="Игр сыграно:"
                            value={stats?.game_count ?? 0}
                        />
                    </div>
                </div> :
                <Placeholder className={styles["stats-loader"]} />
            }
        </div>
    )
}

export default memo(StatsSection)
