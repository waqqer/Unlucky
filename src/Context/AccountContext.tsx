import type { UserPayload, UserRole } from "@/Shared/Types/UserTypes"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type SPWMini from "spwmini/client"
import type { User } from "spwmini/types"
import { AuthContext } from "./AuthContext"
import type { Badges, UserInfo } from "@/Api/User"
import UserApi from "@/Api/User"

export interface AccountContextValues {
    user: User | null
    account: UserPayload | null
    spm: SPWMini | null
    
    balance: number
    userId: number
    role: UserRole

    badge: string,
    badges: string[]

    ReloadUserInfo: () => void
    ReloadUserBadges: () => void
    changeBadge: (badge: string) => void

    setBalanceTo: (value: number) => void
    incrementBalance: (value: number) => void
}

export const AccountContext = createContext<AccountContextValues>(undefined!)

export const AccountProvider = ({ children }: any) => {
    const { user, spm, account } = useContext(AuthContext)

    const [balance, setBalance] = useState<number>(0)
    const [userId, setUserId] = useState<number>(0)
    const [role, setRole] = useState<UserRole>("USER")

    const [badge, setBadge] = useState<string>("")
    const [badges, setBadges] = useState<string[]>([])

    const ReloadUserInfo = useCallback(async () => {
        if (!account) 
            return

        const data: UserInfo = await UserApi.getUser(account.UUID)
        setBalance(data.balance)
        setUserId(data.userId)
        setRole(data.role)
    }, [account])

    const ReloadUserBadges = useCallback(async () => {
        if (!account)
            return

        const data: Badges = await UserApi.getUserBadges(account.UUID)
        setBadge(data.current_badge)
        setBadges(data.badges)
    }, [account])

    const changeBadge = useCallback(async (badge: string) => {
        if(!account)
            return
        
        setBadge(badge)
        await UserApi.setUserBadge(account.UUID, badge)
    }, [account])

    const setBalanceTo = useCallback((value: number) => {
        if(value > 0) {
            setBalance(value)
        }
    }, [])

    const incrementBalance = useCallback((value: number) => {
        setBalance(prev => prev + value)
    }, [])

    useEffect(() => {
        if (!account)
            return

        const fetchUserData = async () => {
            await Promise.all([
                await ReloadUserInfo(),
                await ReloadUserBadges()
            ])
        }

        fetchUserData()
    }, [account])

    const values: AccountContextValues = useMemo(() => ({
        user,
        account,
        spm,

        balance,
        role,
        userId,

        badge,
        badges,

        ReloadUserInfo,
        ReloadUserBadges,
        changeBadge,
        setBalanceTo,
        incrementBalance
    }), [user, account, spm, balance, badge, badges, ReloadUserInfo, ReloadUserBadges, changeBadge, role, userId, setBalanceTo, incrementBalance])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}