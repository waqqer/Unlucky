import { setSPUser, subscribeUserChange } from "@/Api/Api"
import useSP from "@/Hooks/useSP"
import type { SPUser, UserPayload } from "@/Shared/Types/UserTypes"
import { createContext, useEffect, useMemo, useState } from "react"
import type SPWMini from "spwmini/client"

export interface AuthContextValues {
    user: SPUser | null
    account: UserPayload | null
    isLoading: boolean
    isAuth: boolean
    spm: SPWMini | null
}

export const AuthContext = createContext<AuthContextValues>(undefined!)

export const AuthProvider = ({ children }: any) => {
    const { user: spUser, spm } = useSP()
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [user, setUser] = useState<UserPayload | null>(null)

    useEffect(() => {
        subscribeUserChange((updatedUser) => {
            setUser(updatedUser)
            setIsAuth(!!updatedUser)
        })
    }, [])

    useEffect(() => {
        if (spUser) {
            setSPUser(spUser)
            setIsLoading(false)
            return
        }

        setSPUser(null)
        setIsLoading(true)
    }, [spUser])

    const values: AuthContextValues = useMemo(() => ({
        user: spUser,
        account: user,
        isLoading,
        isAuth,
        spm
    }), [spUser, user, isLoading, isAuth, spm])

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}
