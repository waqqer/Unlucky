import { useState, useEffect, useCallback } from "react"
import StatsGroup from "@/components/StatsGroup"
import StatCard from "@/components/StatCard"
import GStatsApi from "@/api/g_stats"
import Placeholder from "@/components/Placeholder"
import styles from "./ArStats.module.css"

const ArStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadStats = useCallback(() => {
        GStatsApi.get()
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
    }, [loadStats])

    if (loading) {
        return (
            <StatsGroup title="Статистика по арам">
                <Placeholder className={styles.loader} />
            </StatsGroup>
        )
    }

    return (
        <StatsGroup title="Статистика по арам">
            <StatCard
                icon="fa-solid fa-coins"
                label="Потрачено на выиграши"
                value={stats?.wins_amount ?? 0}
                valueColor="win"
            />
            <StatCard
                icon="fa-solid fa-wallet"
                label="Всего аров депнуто"
                value={stats?.total_amount ?? 0}
                valueColor="primary"
            />
            <StatCard
                icon="fa-solid fa-arrow-trend-down"
                label="Всего получено с поражений"
                value={stats?.loss_amount ?? 0}
                valueColor="lose"
            />
        </StatsGroup>
    )
}

export default ArStats
