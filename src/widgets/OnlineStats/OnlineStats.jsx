import { useState, useEffect, useCallback } from "react"
import StatsGroup from "@/components/StatsGroup"
import StatCard from "@/components/StatCard"
import Placeholder from "@/components/Placeholder"
import styles from "./OnlineStats.module.css"
import GStatsApi from "../../api/g_stats"

const OnlineStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadStats = useCallback(() => {
        GStatsApi.getOnline()
            .then(data => {
                setStats(data)
                setLoading(false)
            })
            .catch(() => {
                setStats(null)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        loadStats()

        const interval = setInterval(loadStats, 10000)
        return () => clearInterval(interval)
    }, [loadStats])

    if (loading) {
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
                value={stats?.current ?? 0}
            />
            <StatCard
                icon="fa-solid fa-users"
                label="Всего игроков"
                value={stats?.all_time ?? 0}
            />
            <StatCard
                icon="fa-solid fa-crown"
                label="Пиковый онлайн"
                value={stats?.peak ?? 0}
            />
        </StatsGroup>
    )
}

export default OnlineStats
