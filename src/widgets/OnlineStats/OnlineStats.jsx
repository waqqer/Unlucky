import { useState, useEffect, useCallback, useContext } from "react"
import StatsGroup from "@/components/StatsGroup"
import StatCard from "@/components/StatCard"
import Placeholder from "@/components/Placeholder"
import styles from "./OnlineStats.module.css"
import { AppContext } from "@/context/AppContext"
import GStatsApi from "@/api/g_stats"

const OnlineStats = () => {
    const { online, isConnected, peak } = useContext(AppContext)
    const [all, setAll] = useState(0)

    useEffect(() => {
        GStatsApi.getUserCount()
            .then(c => setAll(c.all_time))
    }, [])

    if (!isConnected) {
        return (
            <StatsGroup title="Статистика по онлайну">
                <Placeholder className={styles.loader} />
            </StatsGroup>
        )
    }

    return (
        <StatsGroup title="Статистика по онлайну">
            <StatCard
                icon="fa-solid fa-signal"
                label="Игроков онлайн"
                value={online ?? 0}
            />
            <StatCard
                icon="fa-solid fa-users"
                label="Всего игроков"
                value={all ?? 0}
            />
            <StatCard
                icon="fa-solid fa-crown"
                label="Пиковый онлайн"
                value={peak ?? 0}
            />
        </StatsGroup>
    )
}

export default OnlineStats
