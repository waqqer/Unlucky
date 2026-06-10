import useHead from "@/Hooks/userHead"
import { memo } from "react"

interface HeadProps {
    user?: string,
    size?: number
}

const Head = (props: HeadProps) => {
    const {
        user,
        size = 32
    } = props

    return (
        <img 
            src={useHead(user)} 
            alt="User head"
            height={size}
            width={size}
            draggable={false}
            loading="lazy"
        />
    )
}

export default memo(Head)