import type { UserPayload, UserRole } from "@/Shared/Types/UserTypes"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { PropsWithChildren } from "react"
import type SPWMini from "spwmini/client"
import type { User } from "spwmini/types"
import { AuthContext } from "./AuthContext"
import type { Badges, Policy, ReferralInfo, StreakStatus, UserInfo } from "@/Api/User"
import UserApi from "@/Api/User"

export interface AccountContextValues {
    user: User | null
    account: UserPayload | null
    spm: SPWMini | null

    balance: number
    userId: number
    role: UserRole

    streak: number
    streakStatus: StreakStatus
    setStreakInfo: (data: { streak: number, status: StreakStatus }) => void

    badge: string,
    badges: string[],

    policy: Policy | null,
    referralInfo: ReferralInfo | null,
    setReferralInfo: (data: ReferralInfo) => void

    ReloadUserInfo: () => void
    ReloadUserBadges: () => void
    changeBadge: (badge: string) => void
    addBadge: (badge: string | string[]) => void
    removeBadge: () => void
    acceptPolicy: () => void

    setBalanceTo: (value: number) => void
    incrementBalance: (value: number) => void
    beginBalanceDeferral: () => void
    queueBalanceUpdate: (value: number) => void
    flushBalanceUpdate: () => void
    endBalanceDeferral: () => void
}

export const AccountContext = createContext<AccountContextValues>(undefined!)

export const AccountProvider = ({ children }: PropsWithChildren) => {
    const { user, spm, account } = useContext(AuthContext)

    const [balance, setBalance] = useState<number>(0)
    const isBalanceDeferredRef = useRef<boolean>(false)
    const pendingBalanceRef = useRef<number | null>(null)
    const [userId, setUserId] = useState<number>(0)
    const [role, setRole] = useState<UserRole>("ADMIN")

    const [streak, setStreak] = useState<number>(0)
    const [streakStatus, setStreakStatus] = useState<StreakStatus>("DEAD")

    const [badge, setBadge] = useState<string>("")
    const [badges, setBadges] = useState<string[]>([])

    const [policy, setPolicy] = useState<Policy | null>(null)
    const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null)

    const setStreakInfo = useCallback(async (data: {
        streak: number,
        status: StreakStatus
    }) => {
        setStreak(data.streak)
        setStreakStatus(data.status)
    }, [])

    const ReloadUserInfo = useCallback(async () => {
        if (!account)
            return

        const data: UserInfo = await UserApi.getUser(account.UUID)
        setBalance(data.balance)
        setUserId(data.userId)
        setRole(data.role)
        setPolicy({
            policy_accepts: data.policy_accepts,
            policy_accepts_date: data.policy_accepts_date
        })
        setStreak(data.streak)
        setStreakStatus(data.streakStatus)
        setReferralInfo(data.referral)
    }, [account])

    const acceptPolicy = useCallback(async () => {
        if (!account)
            return

        const data: Policy = await UserApi.acceptPolicy(account.UUID)
        setPolicy(data)
    }, [account])

    const ReloadUserBadges = useCallback(async () => {
        if (!account)
            return

        const data: Badges = await UserApi.getUserBadges(account.UUID)
        setBadge(data.current_badge)
        setBadges(data.badges)
    }, [account])

    const changeBadge = useCallback(async (badge: string) => {
        if (!account)
            return

        setBadge(badge)
        await UserApi.setUserBadge(account.UUID, badge)
    }, [account])

    const addBadge = useCallback(async (badge: string | string[]) => {
        if (!account)
            return

        const value = typeof badge === "string" ? [badge] : badge
        setBadges(prev => [...new Set([...prev, ...value])])
    }, [account])

    const removeBadge = useCallback(async () => {
        if (!account)
            return

        setBadge("")
        await UserApi.removeUserBadge(account.UUID)
    }, [account])

    const setBalanceTo = useCallback((value: number) => {
        if (Number.isFinite(value) && value >= 0) {
            pendingBalanceRef.current = null
            setBalance(value)
        }
    }, [])

    const incrementBalance = useCallback((value: number) => {
        pendingBalanceRef.current = null
        setBalance(prev => prev + value)
    }, [])

    const beginBalanceDeferral = useCallback(() => {
        isBalanceDeferredRef.current = true
    }, [])

    const flushBalanceUpdate = useCallback(() => {
        const pendingBalance = pendingBalanceRef.current
        pendingBalanceRef.current = null

        if (pendingBalance !== null && pendingBalance >= 0) {
            setBalance(pendingBalance)
        }
    }, [])

    const queueBalanceUpdate = useCallback((value: number) => {
        if (!Number.isFinite(value) || value < 0) return

        if (isBalanceDeferredRef.current) {
            pendingBalanceRef.current = value
            return
        }

        pendingBalanceRef.current = null
        setBalance(value)
    }, [])

    const endBalanceDeferral = useCallback(() => {
        isBalanceDeferredRef.current = false
        flushBalanceUpdate()
    }, [flushBalanceUpdate])

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
    }, [account, ReloadUserBadges, ReloadUserInfo])

    const values: AccountContextValues = useMemo(() => ({
        user,
        account,
        spm,

        balance,
        role,
        userId,

        badge,
        badges,

        streak,
        streakStatus,

        policy,
        referralInfo,
        setReferralInfo,

        acceptPolicy,
        ReloadUserInfo,
        ReloadUserBadges,
        changeBadge,
        addBadge,
        setBalanceTo,
        incrementBalance,
        beginBalanceDeferral,
        queueBalanceUpdate,
        flushBalanceUpdate,
        endBalanceDeferral,
        removeBadge,
        setStreakInfo
    }), [policy, referralInfo, streak, streakStatus, user, account, spm, balance, badge, badges, acceptPolicy, ReloadUserInfo, ReloadUserBadges, changeBadge, setStreakInfo, role, userId, setBalanceTo, incrementBalance, beginBalanceDeferral, queueBalanceUpdate, flushBalanceUpdate, endBalanceDeferral, removeBadge, addBadge])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}
