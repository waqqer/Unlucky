import { useEffect, useRef, useState } from "react"
import SPWMini from "spwmini/client"

const useSPW = () => {
    const app = useRef(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (!app.current) {
            app.current = new SPWMini(import.meta.env.VITE_APP_ID)
        }

        const initHandle = (userData) => {
            setUser(userData)
        }

        app.current.on('initResponse', initHandle)

        app.current.initialize()

        return () => {
            app.current.off('initResponse', initHandle)
            app.current.dispose()
            app.current = null
        }
    }, [])

    return {
        spm: app.current,
        user
    }
}

export default useSPW