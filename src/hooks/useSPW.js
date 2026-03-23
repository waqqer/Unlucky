import { useEffect, useRef, useState } from "react"
import SPWMini from "spwmini/client"

const appId = "30e34748-e1bb-4072-a5fb-b7d0df6aae8a"

const useSPW = () => {
    const app = useRef(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (!app.current) {
            app.current = new SPWMini(appId)
        }

        console.log("Connecting...")

        const initHandle = (userData) => {
            console.log("Success connect!")
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

    return user
}

export default useSPW