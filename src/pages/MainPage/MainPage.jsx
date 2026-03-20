import { useRef, useEffect, useState} from "react"
import SPWMini from "spwmini/client"

import Title from "@/components/Title"
import useSPW from "../../hooks/useSpw"

const MainPage = () => {
    const spm = useRef(new SPWMini("e2b94c4f-c0be-442d-9554-59f03c8c84ce", { autoinit: true }))
    const [user, setUser] = useState(null)
    useEffect(() => {
        const handleReady = (user) => {
            setUser(user)
        }

        spm.on('initResponce', handleReady)

        return () => {
            spm.off('initResponce', handleReady)
        }
    }, [])

    return (
        <Title title="Unlucky" desc={`Hello, ${user.username}`} />
    )
}

export default MainPage