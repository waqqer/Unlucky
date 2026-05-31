import { useEffect, useRef, useState } from "react"
import SPWMini from "spwmini/client"

const useSPW = () => {
    const spmRef = useRef(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (spmRef.current)
            return

        const app = new SPWMini(import.meta.env.VITE_APP_ID)
        spmRef.current = app

        const initHandle = (userData) => {
            if (userData?.minecraftUUID)
                setUser(userData)
        }

        app.on('initResponse', initHandle)
        app.initialize()

        return () => {
            app.off('initResponse', initHandle)
            app.dispose()
            spmRef.current = null
        }
    }, [])

    return {
        spm: spmRef.current,
        user
    }
}

export default useSPW