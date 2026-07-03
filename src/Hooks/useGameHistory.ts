import HistoryApi, { type GameHistory, type GameTitle } from "@/Api/History"
import { AuthContext } from "@/Context/AuthContext"
import { useCallback, useContext, useEffect, useState } from "react"

const HISTORY_LIMIT = 20

const useGameHistory = (gameName: GameTitle) => {
    const { account } = useContext(AuthContext)
    const [history, setHistory] = useState<GameHistory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isCancelled = false

        setIsLoading(true)
        setError(null)

        HistoryApi.getGameHistory(gameName, HISTORY_LIMIT)
            .then(items => {
                if (isCancelled) return
                setHistory(items)
            })
            .catch(() => {
                if (isCancelled) return
                setError("Не удалось загрузить историю")
            })
            .finally(() => {
                if (isCancelled) return
                setIsLoading(false)
            })

        return () => {
            isCancelled = true
        }
    }, [gameName])

    const pushHistory = useCallback((amount: number) => {
        if (!account) return

        const item: GameHistory = {
            result: amount > 0 ? "WIN" : "LOSE",
            amount,
            date: new Date().toISOString(),
            user: {
                name: account.name,
                uuid: account.UUID
            }
        }

        setHistory(prev => [item, ...prev].slice(0, HISTORY_LIMIT))
    }, [account])

    return {
        history,
        isHistoryLoading: isLoading,
        historyError: error,
        pushHistory
    }
}

export default useGameHistory
