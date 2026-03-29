import { useState, useEffect } from "react"
import HistoryApi from "@/api/history"
import Title from "@/components/Title"
import GlobalHistoryList from "@/components/GlobalHistoryList"
import styles from "./GameHistory.module.css"

const GameHistory = (props) => {
    const {
        className,
        gameName = "Слоты"
    } = props

    const [history, setHistory] = useState([])

    useEffect(() => {
        HistoryApi.getAll(50, gameName)
            .then(data => {
                setHistory(data ?? [])
            })
            .catch(_ => {
                setHistory([])
                console.warn("Failed to load game history")
            })
    }, [gameName])

    return (
        <div className={`${styles["game-history"]} ${className}`}>
            <Title className={styles.title}>
                <h1 className={styles["history-title"]}>История</h1>
            </Title>
            <GlobalHistoryList history={history} />
        </div>
    )
}

export default GameHistory
