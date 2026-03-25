import { createContext, useEffect, useMemo, useState } from "react"
import useSPW from "@/hooks/useSpw"
import useHead from "@/hooks/useHead"
import UserApi from "@/api/users"

export const AccountContext = createContext({})

export const AccountProvider = ({ children }) => {
    const { user, spm } = useSPW()
    const head = useHead(user)

    const [isLoaded, setIsLoaded] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        if(!user) return
        const data = UserApi.getOrCreate(user, "USER")
        data.then(u => setUserData(u))
    }, [user])

    useEffect(() => {
        if(!userData) return
        setIsLoaded(true)
    }, [userData])
    
    const values = useMemo(() => ({
        user,
        spm,
        head,
        account: userData,
        isLoaded
    }), [user, spm, head, userData, isLoaded])

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}