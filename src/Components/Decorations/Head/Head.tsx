import { AccountContext } from "@/Context/AccountContext"
import useHead from "@/Hooks/useHead"
import type { Classable, Resizable } from "@/Shared/Types/PropsTypes"
import { memo, useContext, useEffect, useState } from "react"

interface UIHeadProps extends Classable, Resizable {
    uuid?: string
}

const Head = (props: UIHeadProps) => {
    const {
        className = "",
        uuid,
        size = 32
    } = props
    
    const { user } = useContext(AccountContext)
    const [head, setHead] = useState<string>()

    useEffect(() => {
        if(uuid) {
            setHead(uuid)
        } else {
            setHead(user?.minecraftUUID || "steve")
        }
    }, [uuid, user])

    const headUrl = useHead(head)

    return (
        <img
            src={headUrl}
            alt="User head"
            width={size}
            height={size}
            className={`${className}`}
            draggable={false}
            loading="lazy"
        />
    )
}

export default memo(Head)