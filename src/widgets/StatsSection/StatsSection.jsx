import { useState, useCallback, useEffect, useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import StatsApi from "@/api/statistics"
import UserStatItem from "@/components/UserStatItem"
import Placeholder from "@/components/Placeholder"
import styles from "./StatsSection.module.css"

const StatsSection = (props) => {
    const {
        className
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

    const formatDate = (dateString) => {
        if (!dateString) return "—"
        const date = new Date(dateString)
        return date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

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
                    <div className={styles["stat-row"]}>
                        <UserStatItem
                            label="Побед:"
                            value={stats?.wins ?? 0}
                            valueClass={styles["stat-value-win"]}
                        />
                        <UserStatItem
                            label="Поражений:"
                            value={stats?.losses ?? 0}
                            valueClass={styles["stat-value-lose"]}
                        />
                    </div>
                    <div className={styles["stat-row"]}>
                        <UserStatItem
                            label="Последняя игра:"
                            value={formatDate(stats?.last_game_date)}
                            fullWidth
                            valueClass={styles["stat-date"]}
                        />
                    </div>
                </div> :
                <Placeholder className={styles["stats-loader"]} />
            }
        </div>
    )
}

export default StatsSection
