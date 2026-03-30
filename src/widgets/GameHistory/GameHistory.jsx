import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react"
import HistoryApi from "@/api/history"
import Title from "@/components/Title"
import GlobalHistoryList from "@/components/GlobalHistoryList"
import styles from "./GameHistory.module.css"

const GameHistory = forwardRef((props, ref) => {
    const {
        className,
        gameName = "Слоты"
    } = props

    const [history, setHistory] = useState([])

    const loadHistory = useCallback(() => {
        HistoryApi.getAll(50, gameName)
            .then(data => {
                setHistory(data ?? [])
            })
            .catch(() => {
                setHistory([])
                console.warn("Failed to load game history")
            })
    }, [gameName])

    useEffect(() => {
        loadHistory()
    }, [loadHistory])

    // Предоставляем внешний доступ к функции обновления
    useImperativeHandle(ref, () => ({
        refreshHistory: loadHistory
    }))

    return (
        <div className={`${styles["game-history"]} ${className}`}>
            <Title className={styles.title}>
                <h1 className={styles["history-title"]}>История</h1>
            </Title>
            <GlobalHistoryList history={history} />
        </div>
    )
})

export default GameHistory
