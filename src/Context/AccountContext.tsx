import type { UserPayload } from "@/Shared/Types/UserTypes"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type SPWMini from "spwmini/client"
import type { User } from "spwmini/types"
import { AuthContext } from "./AuthContext"
import type { UserInfo } from "@/Api/User"
import UserApi from "@/Api/User"

export interface AccountContextValues {
    user: User | null
    account: UserPayload | null
    spm: SPWMini | null
    userInfo: UserInfo | null,

    ReloadUserInfo: () => void
}

export const AccountContext = createContext<AccountContextValues>(undefined!)

export const AccountProvider = ({ children }: any) => {
    const { user, spm, account } = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

    const ReloadUserInfo = useCallback(async () => {
        if (!account) return

        const data: UserInfo = await UserApi.getUser(account.UUID)
        setUserInfo(data)
    }, [account])

    useEffect(() => {
        if (!account)
            return

        const fetchUserData = async () => {
            await ReloadUserInfo()
        }

        fetchUserData()
    }, [account])

    const values: AccountContextValues = useMemo(() => ({
        user,
        account,
        spm,
        userInfo,
        ReloadUserInfo
    }), [user, account, spm, userInfo, ReloadUserInfo])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}