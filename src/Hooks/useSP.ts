import { useEffect, useRef, useState } from "react"
import SPWMini from "spwmini/client"
import type { User } from "spwmini/types"

const useSP = () => {
    const spRef = useRef<SPWMini>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if(!spRef.current) {
            const sp = new SPWMini(import.meta.env.VITE_APP_ID)
            spRef.current = sp

            const ininHandle = (user: User) => {
                setUser(user)
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