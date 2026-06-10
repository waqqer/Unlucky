import useSP from "@/Hooks/useSP";
import { createContext, useMemo } from "react";

export const SpContext = createContext({})

export const SpProvider = ({ children }: any) => {
    const spUser = useSP()
    console.log(spUser.user)

    const values = useMemo(() => ({
        
    }), [])

    return (
        <SpContext.Provider value={values}>
            {children}
        </SpContext.Provider>
    )
}