import { memo, useState, useEffect, useCallback } from "react"
import StatsGroup from "@/components/StatsGroup"
import GStatsApi from "@/api/g_stats"
import Placeholder from "@/components/Placeholder"
import styles from "./GamesStats.module.css"

const GamesStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadStats = useCallback(() => {
        GStatsApi.gamesStats()
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

    const gameIcons = {
        slots: "fa-solid fa-coins",
        miner: "fa-solid fa-gem",
        rocket: "fa-solid fa-paper-plane"
    }

    const gameNames = {
        slots: "Слоты",
        miner: "Майнер",
        rocket: "Ракетa"
    }

    if (loading) {
        return (
            <StatsGroup title="Статистика по играм">
                <Placeholder className={styles.loader} />
            </StatsGroup>
        )
    }

    const games = Object.entries(stats || {})

    return (
        <StatsGroup title="Статистика по играм">
            <div className={styles["games-list"]}>
                {games.length > 0 ? (
                    games.map(([gameKey, count]) => (
                        <div key={gameKey} className={styles["game-item"]}>
                            <div className={styles["game-info"]}>
                                <i className={`${styles.icon} ${gameIcons[gameKey] || "fa-solid fa-dice"}`}></i>
                                <span className={styles.name}>{gameNames[gameKey] || gameKey}</span>
                            </div>
                            <span className={styles.count}>{count} игр</span>
                        </div>
                    ))
                ) : (
                    <p className={styles.empty}>Нет данных об играх</p>
                )}
            </div>
        </StatsGroup>
    )
}

export default memo(GamesStats)
