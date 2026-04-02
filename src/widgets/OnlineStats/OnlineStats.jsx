import { useState, useEffect, useCallback } from "react"
import StatsGroup from "@/components/StatsGroup"
import StatCard from "@/components/StatCard"
import Placeholder from "@/components/Placeholder"
import styles from "./OnlineStats.module.css"

const OnlineStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadStats = useCallback(() => {
        
    }, [])

    useEffect(() => {
        loadStats()
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
                value={stats?.current_online ?? 0}
            />
            <StatCard
                icon="fa-solid fa-users"
                label="Всего игроков"
                value={stats?.total_users ?? 0}
            />
            <StatCard
                icon="fa-solid fa-crown"
                label="Пиковый онлайн"
                value={stats?.peak_online ?? 0}
            />
        </StatsGroup>
    )
}

export default OnlineStats
