import { createContext, useEffect, useMemo, useState, useCallback } from "react"
import useSPW from "@/hooks/useSpw"
import useHead from "@/hooks/useHead"
import UserApi from "@/api/users"
import BalanceApi from "@/api/balance"

export const AccountContext = createContext({})

export const AccountProvider = ({ children }) => {
    const { user: spwUser, spm } = useSPW()
    const head = useHead(spwUser)

    const [isLoaded, setIsLoaded] = useState(false)
    const [account, setAccount] = useState(null)

    // Загрузка данных пользователя при инициализации
    useEffect(() => {
        if (!spwUser) return
        UserApi.getOrCreate(spwUser, "USER")
            .then(data => {
                setAccount(data)
                setIsLoaded(true)
            })
            .catch(err => {
                console.error("Failed to load user data:", err)
                setIsLoaded(true)
            })
    }, [spwUser])

    // Обновление данных пользователя
    const updateUser = useCallback((newData) => {
        setAccount(prev => prev ? { ...prev, ...newData } : newData)
    }, [])

    // Изменение баланса через API
    const changeBalance = useCallback(async (amount) => {
        const username = spwUser?.name || account?.name
        if (!username || !account) {
            console.warn("Cannot change balance: user not authenticated", { spwUser, account })
            return null
        }

        try {
            const result = await BalanceApi.change(username, amount)
            if (result) {
                setAccount(prev => prev ? { ...prev, balance: result.balance?.toString() || prev.balance } : prev)
            }
            return result
        } catch (error) {
            console.error("Failed to change balance:", error)
            return null
        }
    }, [spwUser, account])

    // Получение баланса
    const getBalance = useCallback(() => {
        return parseFloat(account?.balance || 0)
    }, [account])

    // Обновление данных пользователя с сервера
    const refreshAccount = useCallback(async () => {
        if (!spwUser) return null
        try {
            const data = await UserApi.getByName(spwUser.name)
            if (data) {
                setAccount(data)
            }
            return data
        } catch (error) {
            console.error("Failed to refresh account:", error)
            return null
        }
    }, [spwUser])

    const values = useMemo(() => ({
        user: spwUser,
        spm,
        head,
        account,
        isLoaded,
        updateUser,
        changeBalance,
        getBalance,
        refreshAccount
    }), [spwUser, spm, head, account, isLoaded, updateUser, changeBalance, getBalance, refreshAccount])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}
