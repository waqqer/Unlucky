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
        if (!userUuid) return null
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
        if(!account) {
            return false
        }

        return account.terms_accept
    }, [account])

    const acceptTerms = useCallback(async () => {
        const uuid = spwUser?.minecraftUUID
        if(!uuid)
            return

        try {
            const data = await UserApi.acceptTerms(uuid)
            refreshAccount()
        } catch (error) {
            console.error("Ошибка при принятии условий пользователя: ", error)
            return null
        }
    }, [])

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
    }, [spm])

    const values = useMemo(() => ({
        user: spwUser,
        spm,
        head,
        account,
        isLoaded,
        updateUser,
        changeBalance,
        getBalance,
        refreshAccount,
        termsAccepted,
        acceptTerms
    }), [spwUser, spm, head, account, isLoaded, updateUser, changeBalance, getBalance, refreshAccount, acceptTerms, termsAccepted])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}
