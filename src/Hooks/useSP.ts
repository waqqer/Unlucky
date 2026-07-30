import { useEffect, useRef, useState } from "react"
import SPWMini from "spwmini/client"
import type { UserData } from "spwmini/types"
import type { SPUser } from "@/Shared/Types/UserTypes"

const useSP = () => {
    const spRef = useRef<SPWMini>(null)
    const [user, setUser] = useState<SPUser | null>(null)

    useEffect(() => {
        if(!spRef.current) {
            const sp = new SPWMini(import.meta.env.VITE_APP_ID, { autoinit: false })
            spRef.current = sp

            const ininHandle = (user: UserData) => {
                setUser(user as SPUser)
            }

            sp.on("initResponse", ininHandle)
            sp.initialize()

            return () => {
                sp.off("initResponse", ininHandle)
                sp.dispose()
                spRef.current = null
            }
        }
    }, [])

    return {
        spm: spRef.current,
        user
    }
}

export default useSP
