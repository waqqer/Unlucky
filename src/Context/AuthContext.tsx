import { $api, getUser, setAccessToken } from "@/Api/Api"
import useSP from "@/Hooks/useSP";
import type { UserPayload } from "@/Shared/Types/UserTypes";
import { createContext, useEffect, useMemo, useState } from "react"
import type SPWMini from "spwmini/client";
import type { User } from "spwmini/types";

export interface AuthContextValues {
    user: User | null
    account: UserPayload | null
    isLoading: boolean
    isAuth: boolean
    spm: SPWMini | null
}

export const AuthContext = createContext<AuthContextValues | undefined>(undefined)

export const AuthProvider = ({ children }: any) => {
    const { user: spUser, spm } = useSP()
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [user, setUser] = useState<UserPayload | null>(null)

    useEffect(() => {
        const initAuth = async () => {
            const savedRefresh = localStorage.getItem("refresh_token")
            if (savedRefresh) {
                try {
                    const res = await $api.post("/private/api/auth/refresh", {
                        refresh: savedRefresh
                    })
                    const { access, refresh } = res.data

                    setAccessToken(access)
                    localStorage.setItem("refresh_token", refresh)

                    setUser(getUser())
                    setIsAuth(true)
                    setIsLoading(false)
                    return
                } catch {
                    localStorage.removeItem("refresh_token")
                }
            }

            if (spUser) {
                try {
                    const response = await $api.post('/private/api/auth/login', spUser);
                    const { access, refresh } = response.data

                    setAccessToken(access)
                    localStorage.setItem('refresh_token', refresh)

                    setUser(getUser())
                    setIsAuth(true)
                } catch {
                    console.error("Ошибка авторизации")
                } finally {
                    setIsLoading(false)
                }
            } else {
                if (!savedRefresh)
                    setIsLoading(true)
            }
        }

        initAuth()
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