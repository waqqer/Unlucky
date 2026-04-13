import { useState, useEffect, useCallback, forwardRef } from "react"
import HistoryApi from "@/api/history"
import Title from "@/components/Title"
import GlobalHistoryList from "@/components/GlobalHistoryList"
import styles from "./GameHistory.module.css"

const GameHistory = forwardRef((props, ref) => {
    const {
        className = "",
        gameName = "Слоты",
        limit = 50,
        refreshTrigger = 0
    } = props

    const [history, setHistory] = useState([])

    const loadHistory = useCallback(() => {
        HistoryApi.getAll(limit, gameName)
            .then(data => {
                setHistory(data ?? [])
            })
            .catch(() => {
                setHistory([])
            })
    }, [gameName, limit])

    useEffect(() => {
        loadHistory()
    }, [loadHistory])

    useEffect(() => {
        loadHistory()
    }, [refreshTrigger, loadHistory])

    return (
        <div className={`${styles["game-history"]}`}>
            <Title className={styles.title}>
                <h1 className={styles["history-title"]}>История</h1>
            </Title>
            <GlobalHistoryList history={history} className={className}/>
        </div>
    )
})

export default GameHistory
