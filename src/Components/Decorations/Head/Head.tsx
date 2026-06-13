import { AccountContext } from "@/Context/AccountContext"
import useHead from "@/Hooks/userHead"
import { memo, useContext, useEffect, useState } from "react"

interface HeadProps {
    user?: string,
    size?: number
}

const Head = (props: HeadProps) => {
    const {
        user,
        size = 32
    } = props

    const { user: spUser } = useContext(AccountContext)
    const [head, setHead] = useState<string>("steve")
    
    useEffect(() => {
        if(user) {
            setHead(useHead(user))
        }
        else if(spUser) {
            setHead(useHead(spUser.minecraftUUID))
        }
    }, [user, spUser])

    return (
        <img 
            src={head} 
            alt="User head"
            height={size}
            width={size}
            draggable={false}
            loading="lazy"
        />
    )
}

export default memo(Head)