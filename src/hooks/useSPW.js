import { useEffect, useRef, useState } from "react"
import SPWMini from "spwmini/client"

const appId = "e2b94c4f-c0be-442d-9554-59f03c8c84ce"
const minecraft_heads_url = "https://mc-heads.net/avatar/"

const useSPW = () => {
    const spm = useRef(new SPWMini(appId, { autoinit: false }))

    const [user, setUser] = useState(null)

    useEffect(() => {
        console.log("Spw connectiong...")
        const app = spm.current

        app.on('initResponse', userData => {
            setUser(userData)
        })

        app.on('initError', message => {
            console.error(message)
        })

        app.initialize()

        return () => {
            app.dispose()
        }
    }, [])

    return {
        user: user,
        head: minecraft_heads_url + user.minecraftUUID
    }
}

export default useSPW