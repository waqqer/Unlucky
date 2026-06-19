import type { UserPayload } from "@/Shared/Types/UserTypes"
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
    userInfo: UserInfo | null,

    badge: string,
    badges: string[]

    ReloadUserInfo: () => void
    ReloadUserBadges: () => void
    changeBadge: (badge: string) => void
}

export const AccountContext = createContext<AccountContextValues>(undefined!)

export const AccountProvider = ({ children }: any) => {
    const { user, spm, account } = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

    const [badge, setBadge] = useState<string>("")
    const [badges, setBadges] = useState<string[]>([])

    const ReloadUserInfo = useCallback(async () => {
        if (!account) 
            return

        const data: UserInfo = await UserApi.getUser(account.UUID)
        setUserInfo(data)
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
        userInfo,
        badge,
        badges,

        ReloadUserInfo,
        ReloadUserBadges,
        changeBadge
    }), [user, account, spm, userInfo, badge, badges, ReloadUserInfo, ReloadUserBadges, changeBadge])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}