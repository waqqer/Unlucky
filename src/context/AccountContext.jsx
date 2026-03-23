import { createContext } from "react";
import useSPW from "@/hooks/useSpw";
import useHead from "@/hooks/useHead";

export const AccountContext = createContext({})

export const AccountProvider = ({ children }) => {
    const { user, spm } = useSPW()
    const head = useHead(user)
    
    const values = {
        user,
        spm,
        head
    }

    return (
        <AccountContext.Provider value={values}>
            {children}
        </AccountContext.Provider>
    )
}