import HistoryApi, { type GameHistory, type GameTitle } from "@/Api/History"
import { AccountContext } from "@/Context/AccountContext"
import { AuthContext } from "@/Context/AuthContext"
import { useCallback, useContext, useEffect, useState } from "react"

const HISTORY_LIMIT = 20
const getHistoryKey = (item: GameHistory) => `${item.date}-${item.user.uuid}-${item.amount}`

const useGameHistory = (gameName: GameTitle) => {
    const { account, isAuth, isLoading: isAuthLoading } = useContext(AuthContext)
    const { badge } = useContext(AccountContext)

    const [history, setHistory] = useState<GameHistory[]>([])
    const [freshHistoryKey, setFreshHistoryKey] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isCancelled = false

        if (isAuthLoading) {
            return () => {
                isCancelled = true
            }
        }

        if (!isAuth) {
            setHistory([])
            setIsLoading(false)
            setError(null)
            return () => {
                isCancelled = true
            }
        }

        setIsLoading(true)
        setError(null)

        HistoryApi.getGameHistory(gameName, HISTORY_LIMIT)
            .then(items => {
                if (isCancelled) return
                setFreshHistoryKey(null)
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
    }, [gameName, isAuth, isAuthLoading])

    const pushHistory = useCallback((amount: number) => {
        if (!account) return

        const item: GameHistory = {
            result: amount > 0 ? "WIN" : "LOSE",
            amount,
            date: new Date().toISOString(),
            user: {
                name: account.name,
                uuid: account.UUID,
                badge: badge
            }
        }

        setFreshHistoryKey(getHistoryKey(item))
        setHistory(prev => [item, ...prev].slice(0, HISTORY_LIMIT))
    }, [account, badge])

    return {
        history,
        isHistoryLoading: isLoading,
        historyError: error,
        freshHistoryKey,
        pushHistory
    }
}

export default useGameHistory
