import { useEffect, useRef, useState } from "react"
import SPWMini from "spwmini/client"

const appId = ""
const minecraft_heads_url = "https://mc-heads.net/avatar/"

const useSPW = () => {
    const spClient = useRef(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        if(!spClient.current) {
            const sp = new SPWMini(appId)
            sp.initialize()

            spClient.current = sp
            setUser(sp.user)
        }

        return () => {
            if(spClient.current) {
                spClient.current.dispose()
                spClient.current = null
            }
        }
    }, [])

    return {
        head: minecraft_heads_url + user.minecraftUUID,
        user: user
    }
}

export default useSPW