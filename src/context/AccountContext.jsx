import { createContext, useEffect, useMemo, useState, useCallback } from "react"
import useSPW from "@/hooks/useSpw"
import useHead from "@/hooks/useHead"
import UserApi from "@/api/users"
import BalanceApi from "@/api/balance"
import { setToken, setSpUser, ensureValidToken, clearTokenRefreshTimer } from "@/api/auth"

export const AccountContext = createContext({})

export const AccountProvider = ({ children }) => {
    const { user: spwUser, spm } = useSPW()
    const head = useHead(spwUser)
    const fullhead = useHead(spwUser, "head")

    const [isLoaded, setIsLoaded] = useState(false)

    const [account, setAccount] = useState(null)

    const [badges, setBadges] = useState([])
    const [currentBadge, setCurrentBadge] = useState(null)

    const updateBadges = useCallback(() => {
        if (!spwUser)
            return

        UserApi.getBadges(spwUser.minecraftUUID)
            .then(data => {
                setCurrentBadge(data.current || null)
                setBadges(data.list || [])
            })
    }, [spwUser])

    const changeCurrentBadge = useCallback((name) => {
        if (!spwUser)
            return

        setCurrentBadge(name)
        UserApi.setCurrentBadge(spwUser.minecraftUUID, name || "")
    }, [spwUser])

    useEffect(() => {
        if (!spwUser)
            return

        setSpUser(spwUser)

        let cancelled = false

        const initAccount = async () => {
            try {
                const existingToken = await ensureValidToken(spwUser)
                if (cancelled)
                    return

                if (existingToken) {
                    const data = await UserApi.getByUuid(spwUser.minecraftUUID)
                    if (cancelled)
                        return

                    if (data?.UUID) {
                        setAccount(data)
                        setIsLoaded(true)
                        updateBadges()
                        return
                    }
                }

                const data = await UserApi.getOrCreate(spwUser)
                if (cancelled)
                    return

                if (setToken(data?.token)) {
                    setAccount(data)
                    setIsLoaded(true)
                    updateBadges()
                }
            } catch {
                if (!cancelled)
                    setIsLoaded(false)
            }
        }

        initAccount()

        return () => {
            cancelled = true
        }
    }, [spwUser, updateBadges])

    useEffect(() => {
        return () => clearTokenRefreshTimer()
    }, [])

    const updateUser = useCallback((newData) => {
        setAccount(prev => prev ? { ...prev, ...newData } : newData)
    }, [])

    const changeBalance = useCallback(async (amount) => {
        const userUuid = spwUser?.minecraftUUID || account?.UUID
        if (!userUuid || !account) {
            return null
        }

        try {
            const result = await BalanceApi.change(userUuid, amount)
            if (result) {
                setAccount(prev => prev ? { ...prev, balance: result.balance?.toString() || prev.balance } : prev)
            }
            return result
        } catch (error) {
            console.error("Ошибка при смене баланса:", error)
            return null
        }
    }, [spwUser, account])

    const getBalance = useCallback(() => {
        return parseFloat(account?.balance || 0)
    }, [account])

    const refreshAccount = useCallback(async () => {
        const userUuid = spwUser?.minecraftUUID
        if (!userUuid)
            return null

        try {
            const data = await UserApi.getByUuid(userUuid)
            if (data) {
                setAccount(data)
            }
            return data
        } catch (error) {
            console.error("Ошибка при обновлении аккаунта: ", error)
            return null
        }
    }, [spwUser])

    const termsAccepted = useCallback(() => {
        if (!account || !isLoaded) {
            return true
        }

        return account.terms_accept
    }, [account, isLoaded])

    const acceptTerms = useCallback(() => {
        const uuid = spwUser?.minecraftUUID

        if (!uuid)
            return

        try {
            UserApi.acceptTerms(uuid).then(() => {
                window.location.reload()
            })
        } catch (error) {
            console.error("Ошибка при принятии условий пользователя: ", error)
            return null
        }
    }, [spwUser])

    useEffect(() => {
        if (!spm)
            return

        const paymentReact = () => {
            setTimeout(() => {
                refreshAccount()
            }, 1000)
        }

        spm.on("paymentResponse", paymentReact)
        spm.on("openPaymentResponse", paymentReact)

        return () => {
            spm.off("paymentResponse", paymentReact)
            spm.off("openPaymentResponse", paymentReact)
        }
    }, [spm, refreshAccount])

    const values = useMemo(() => ({
        user: spwUser,
        spm,
        head,
        fullhead,
        account,
        isLoaded,
        updateUser,
        badges,
        currentBadge,
        changeCurrentBadge,
        updateBadges,
        changeBalance,
        getBalance,
        refreshAccount,
        termsAccepted,
        acceptTerms
    }), [spwUser, spm, head, account, isLoaded, updateUser, changeBalance, getBalance, refreshAccount, acceptTerms, termsAccepted, badges, currentBadge, changeCurrentBadge, updateBadges])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}
