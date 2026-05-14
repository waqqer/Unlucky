import { useEffect, useState } from "react"
import SPWMini from "spwmini/client"

const useSPW = () => {
    const [spm, setSpm] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const app = new SPWMini(import.meta.env.VITE_APP_ID)
        setSpm(app)

        const initHandle = (userData) => {
            setUser(userData)
        }

        app.on('initResponse', initHandle)
        app.initialize()

        return () => {
            app.off('initResponse', initHandle)
            app.dispose()
        }
    }, [])

    return {
        spm,
        user
    }
}

export default useSPW