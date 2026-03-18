import { useEffect } from "react"
import SPWMini from "spwmini/client"

const appId = ""
const minecraft_heads_url = "https://mc-heads.net/avatar/"

const useSPW = () => {
    let spwclient

    useEffect(() => {
        spwclient = new SPWMini(appId)
        spwclient.initialize()
        
        return () => {
            spwclient.dispose()
        }
    }, [])

    return {
        head: minecraft_heads_url + spwclient.user.minecraftUUID,
        user: spwclient.user
    }
}

export default useSPW